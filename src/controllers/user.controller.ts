import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { IUserService, UserUpdateBodyReq } from "../interfaces/user/user.interface";
import { CLIENT_ROUTES, TYPES } from "../constants";
import { identifyErrors } from "../utils/error_handler";
import { FormatResponse } from "../utils/response_handler";
import { IAuthService } from "../interfaces/auth.interface";
import { ErrorType } from "../types";
import { IEmailService } from "../interfaces/email.interface";
import { IUserBlacklistedTokenService } from "../interfaces/user/user.blacklisted_token.interface";
import { IUserLogsService } from "../interfaces/user/user.logs.interface";

@injectable()
export class UserController {
  private auth: IAuthService;
  private service: IUserService;
  private emailService: IEmailService;
  private blacklisted: IUserBlacklistedTokenService;
  private logs: IUserLogsService;

  constructor(
    @inject(TYPES.AuthService) auth: IAuthService,
    @inject(TYPES.EmailService) emailService: IEmailService,
    @inject(TYPES.UserService) service: IUserService,
    @inject(TYPES.UserBlacklistedTokenService) blacklisted: IUserBlacklistedTokenService,
    @inject(TYPES.UserLogsService) logs: IUserLogsService
  ) {
    this.emailService = emailService;
    this.auth = auth;
    this.service = service;
    this.blacklisted = blacklisted;
    this.logs = logs;
  }

  async onSignIn(req: Request, res: Response) {
    try {
      const email = req.body.email;
      const password = req.body.password;

      const token = await this.service.signIn(email, password);

      return res
        .set("Authorization", `Bearer ${token}`)
        .status(200)
        .json(FormatResponse({}, "User signed in"));
    } catch (err) {
      const errObj = identifyErrors(err);

      return res.status(errObj.code).json(errObj);
    }
  }

  async onSignOut(req: Request, res: Response) {
    try {
      const token = res.locals.token;

      const payload = this.auth.decodeToken(token, "ACCESS");

      await this.service.signOut(payload.userId, payload.sessionId);

      return res.status(200).json(FormatResponse({}, "Successfully logged out."));
    } catch (err) {
      const errObj = identifyErrors(err);

      return res.status(errObj.code).json(errObj);
    }
  }

  async onSignUp(req: Request, res: Response) {
    try {
      const email = req.body.email;
      const password = req.body.password;
      const firstName = req.body.firstName;
      const lastName = req.body.lastName;

      const userData = await this.service.signUp({
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
      });

      const token = this.auth.createToken(
        { email: userData.email, userId: userData.userId },
        "EMAIL_VERIFY"
      );

      await this.emailService.sendEmailVerification({
        clientRoute: "/verify-email",
        emailToSend: userData.email,
        token: token,
      });

      return res.status(200).json(FormatResponse({}, "Created a user"));
    } catch (err) {
      const errObj = identifyErrors(err);

      return res.status(errObj.code).json(errObj);
    }
  }

  async onGetUser(req: Request, res: Response) {
    try {
      const userId = res.locals.userId;
      const token = res.locals.token;

      const data = await this.service.getUser(userId);

      return res.set("Authorization", `Bearer ${token}`).status(200).json(FormatResponse(data));
    } catch (err) {
      const errObj = identifyErrors(err);

      return res.status(errObj.code).json(errObj);
    }
  }

  async onUpdateUser(req: Request, res: Response) {
    try {
      const data: UserUpdateBodyReq = {
        body: {
          ...req.body,
        },
      };

      if (data.body.useCase === "CHANGE_PASSWORD") {
        const userId = res.locals.userId;
        const currentPassword = data.body.currentPassword ?? "";
        const newPassword = data.body.password ?? "";

        if (!currentPassword || !newPassword) throw new Error("missing-inputs" as ErrorType);

        await this.service.updatePassword(userId, currentPassword, newPassword);

        await this.logs.addLog(userId, "UPDATE_PASSWORD");
      }

      if (data.body.useCase === "VERIFY_EMAIL") {
        const token = req.query.token as string;

        if (!token) throw new Error("missing-inputs" as ErrorType);

        const payload = this.auth.decodeToken(token, "EMAIL_VERIFY");

        const onTheList = await this.blacklisted.isBlacklisted(payload.userId, token);

        if (onTheList) throw new Error("request-already-used" as ErrorType);

        const valid = this.auth.verifyToken(token, "EMAIL_VERIFY");

        if (!valid) throw new Error("request-expired" as ErrorType);

        await this.service.verifyEmail(payload.userId, payload.email);

        await this.blacklisted.addTokenToBlacklist({
          token: token,
          userId: payload.userId,
          exp: payload.exp,
          iat: payload.iat,
        });
      }

      if (data.body.useCase === "CHANGE_EMAIL") {
        const userId = res.locals.userId;
        const currentEmail = data.body.email;
        const newEmail = data.body.newEmail;

        if (!currentEmail || !newEmail) throw new Error("missing-inputs" as ErrorType);

        const updateable = await this.logs.updateable(userId, "UPDATE_EMAIL");

        if (!updateable) throw new Error("user-modification-denied" as ErrorType);

        const token = this.auth.createToken(
          { userId: userId, oldEmail: currentEmail, newEmail: newEmail },
          "EMAIL_CHANGE"
        );

        await this.emailService.sendEmailChangeConfirmation({
          clientRoute: CLIENT_ROUTES.EMAIL_CHANGE,
          emailToSend: currentEmail,
          token: token,
        });
      }

      return res.status(200).json(FormatResponse({}, `Use case used: ${data.body.useCase}`));
    } catch (err) {
      const errObj = identifyErrors(err);

      return res.status(errObj.code).json(errObj);
    }
  }

  async onEmailChange(req: Request, res: Response) {
    try {
      const token = req.query.token as string;

      if (!token) throw new Error("missing-inputs" as ErrorType);

      const payload = this.auth.decodeToken(token, "EMAIL_CHANGE");

      const onTheList = await this.blacklisted.isBlacklisted(payload.userId, token);

      if (onTheList) throw new Error("request-already-used" as ErrorType);

      const isValid = this.auth.verifyToken(token, "EMAIL_CHANGE");

      if (!isValid) throw new Error("request-expired" as ErrorType);

      const updateable = await this.logs.updateable(payload.userId, "UPDATE_EMAIL");

      if (!updateable) throw new Error("user-modification-denied" as ErrorType);

      await this.service.updateEmail(payload.userId, payload.oldEmail, payload.newEmail);

      await this.logs.addLog(payload.userId, "UPDATE_EMAIL");

      const emailVerficationToken = this.auth.createToken(
        {
          email: payload.newEmail,
          userId: payload.userId,
        },
        "EMAIL_VERIFY"
      );

      await this.emailService.sendEmailVerification({
        clientRoute: CLIENT_ROUTES.EMAIL_VERIFICATION,
        emailToSend: payload.newEmail,
        token: emailVerficationToken,
      });

      return res.status(200).json(FormatResponse({}));
    } catch (err) {
      const errObj = identifyErrors(err);

      return res.status(errObj.code).json(errObj);
    }
  }

  async onDeleteUser(req: Request, res: Response) {
    try {
      const userId = res.locals.userId;

      await this.service.deleteUser(userId);

      return res.status(200).json(FormatResponse({}, "Deleted the user"));
    } catch (err) {
      const errObj = identifyErrors(err);

      return res.status(errObj.code).json(errObj);
    }
  }
}

// TODO: DO ALL THE TODOS
