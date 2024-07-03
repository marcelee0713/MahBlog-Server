import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { IUserService, UserUpdateBodyReq } from "../interfaces/user/user.interface";
import { TYPES } from "../constants";
import { identifyErrors } from "../utils/error_handler";
import { FormatResponse } from "../utils/response_handler";
import { IAuthService } from "../interfaces/auth.interface";
import { ErrorType } from "../types";

@injectable()
export class UserController {
  private auth: IAuthService;
  private service: IUserService;

  constructor(
    @inject(TYPES.AuthService) auth: IAuthService,
    @inject(TYPES.UserService) service: IUserService
  ) {
    this.auth = auth;
    this.service = service;
  }

  async onSignIn(req: Request, res: Response) {
    try {
      const email = req.body.email;
      const password = req.body.password;

      const token = await this.service.signIn(email, password);

      return res.set("Authorization", `Bearer ${token}`).status(200).json({});
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

      await this.service.signUp({
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
      });

      // TODO: Send an email verification

      return res.status(200).json({});
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
      }

      if (data.body.useCase === "VERIFY_EMAIL") {
        const token = req.query.token as string;

        if (!token) throw new Error("missing-inputs" as ErrorType);

        // TODO: Check if this token is blacklisted
        // TODO: Put the code on this block

        const valid = this.auth.verifyToken(token, "EMAIL_VERIFY");

        if (!valid) throw new Error("request-expired" as ErrorType);

        const payload = this.auth.decodeToken(token, "EMAIL_VERIFY");

        await this.service.verifyEmail(payload.userId, payload.email);
      }

      if (data.body.useCase === "CHANGE_EMAIL") {
        const userId = res.locals.userId;
        const currentEmail = data.body.email;
        const newEmail = data.body.newEmail;

        if (!currentEmail || !newEmail) throw new Error("missing-inputs" as ErrorType);

        await this.service.updateEmail(userId, currentEmail, newEmail);

        // TODO: Aad a user update log in here.
      }

      return res.status(200).json(FormatResponse({}, `Use case used: ${data.body.useCase}`));
    } catch (err) {
      const errObj = identifyErrors(err);

      return res.status(errObj.code).json(errObj);
    }
  }

  async onDeleteUser(req: Request, res: Response) {
    const email = req.body.email;
    const password = req.body.password;
  }
}

// TODO: DO ALL THE TODOS
