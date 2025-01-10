import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { IUserService, UpdateUserBodyReq } from "../../ts/interfaces/user/user.interface";
import { CLIENT_ROUTES, TYPES } from "../../constants";
import { CustomError, identifyErrors } from "../../utils/error_handler";
import { FormatResponse } from "../../utils/response_handler";
import { IAuthService } from "../../ts/interfaces/auth.interface";
import { IEmailService } from "../../ts/interfaces/email.interface";
import { IUserBlacklistedTokenService } from "../../ts/interfaces/user/user.blacklisted_token.interface";
import { IUserLogsService } from "../../ts/interfaces/user/user.logs.interface";
import { GetUserByEmailUseCase, UserData } from "../../ts/types/user/user.types";
import { IUserDevicesService } from "../../ts/interfaces/user/user.devices.interface";
import { IMediaService } from "../../ts/interfaces/media.interface";

@injectable()
export class UserController {
  private auth: IAuthService;
  private service: IUserService;
  private emailService: IEmailService;
  private mediaService: IMediaService;
  private blacklisted: IUserBlacklistedTokenService;
  private logs: IUserLogsService;
  private device: IUserDevicesService;

  constructor(
    @inject(TYPES.AuthService) auth: IAuthService,
    @inject(TYPES.EmailService) emailService: IEmailService,
    @inject(TYPES.MediaService) mediaService: IMediaService,
    @inject(TYPES.UserService) service: IUserService,
    @inject(TYPES.UserBlacklistedTokenService) blacklisted: IUserBlacklistedTokenService,
    @inject(TYPES.UserLogsService) logs: IUserLogsService,
    @inject(TYPES.UserDevicesService) device: IUserDevicesService
  ) {
    this.emailService = emailService;
    this.auth = auth;
    this.mediaService = mediaService;
    this.service = service;
    this.blacklisted = blacklisted;
    this.logs = logs;
    this.device = device;
  }

  async onSignIn(req: Request, res: Response) {
    try {
      const email = req.body.email;
      const password = req.body.password;

      const token = await this.service.signIn({ email, password }, "LOCAL");

      return res
        .set("Authorization", `Bearer ${token}`)
        .status(200)
        .json(FormatResponse({}, "User signed in"));
    } catch (err) {
      const errObj = identifyErrors(err);

      return res.status(errObj.status).json(errObj);
    }
  }

  async OnSignInPasswordLess(req: Request, res: Response) {
    try {
      const user: UserData = req.user as UserData;

      if (!user) throw new CustomError("does-not-exist", "User does not exist.");

      const token = await this.service.signIn({ email: user.email }, "GOOGLE");

      const clientURL = `${process.env.CLIENT_BASE_URL}/api/user/oauth/success?token=${token}`;

      return res.redirect(clientURL);
    } catch (err) {
      const errObj = identifyErrors(err);

      if (errObj.error.code === "wrong-authentication-type")
        return res.redirect(`${process.env.CLIENT_BASE_URL}/sign-in?error=${errObj.error.code}`);

      return res.status(errObj.status).json(errObj);
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

      return res.status(errObj.status).json(errObj);
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
        authAs: "LOCAL",
      });

      const token = this.auth.createToken(
        { email: userData.email, userId: userData.userId },
        "EMAIL_VERIFY"
      );

      await this.emailService.sendEmailVerification({
        clientRoute: CLIENT_ROUTES.EMAIL_VERIFICATION,
        emailToSend: userData.email,
        token: token,
      });

      return res.status(200).json(FormatResponse(userData, "Created a user"));
    } catch (err) {
      const errObj = identifyErrors(err);

      return res.status(errObj.status).json(errObj);
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

      return res.status(errObj.status).json(errObj);
    }
  }

  async onUpdateUser(req: Request, res: Response) {
    try {
      const data: UpdateUserBodyReq = {
        body: {
          ...req.body,
        },
      };

      if (data.body.useCase === "CHANGE_PASSWORD") {
        const userId = res.locals.userId;
        const currentPassword = data.body.password ?? "";
        const newPassword = data.body.newPassword ?? "";

        if (!currentPassword || !newPassword)
          throw new CustomError(
            "missing-inputs",
            "Missing password and newPassword in request body."
          );

        await this.service.updatePassword(userId, currentPassword, newPassword);

        await this.logs.addLog(userId, "UPDATE_PASSWORD");

        if (data.body.removeSessions) await this.service.signOutAll(userId);
      }

      if (data.body.useCase === "RESET_PASSWORD") {
        const token = data.body.token as string;
        const newPassword = data.body.newPassword ?? "";

        if (!newPassword || !token)
          throw new CustomError("missing-inputs", "Missing newPassword and token in request body.");

        if (!token) throw new CustomError("missing-inputs");

        const payload = this.auth.decodeToken(token, "RESET_PASS");

        const onTheList = await this.blacklisted.isBlacklisted(payload.userId, token);

        if (onTheList) throw new CustomError("request-already-used");

        const isValid = this.auth.verifyToken(token, "RESET_PASS");

        if (!isValid) throw new CustomError("request-expired");

        await this.service.resetPassword(payload.userId, newPassword);

        await this.blacklisted.addTokenToBlacklist({ token: token, ...payload });

        if (data.body.removeSessions) await this.service.signOutAll(payload.userId);
      }

      if (data.body.useCase === "VERIFY_EMAIL") {
        const token = data.body.token as string;
        const deviceId = req.headers["device-id"] as string;

        if (!token) throw new CustomError("missing-inputs");

        if (!deviceId) throw new CustomError("device-header-missing");

        const payload = this.auth.decodeToken(token, "EMAIL_VERIFY");

        const onTheList = await this.blacklisted.isBlacklisted(payload.userId, token);

        if (onTheList) throw new CustomError("request-already-used");

        const valid = this.auth.verifyToken(token, "EMAIL_VERIFY");

        if (!valid) throw new CustomError("request-expired");

        await this.service.verifyEmail(payload.userId, payload.email);

        await this.blacklisted.addTokenToBlacklist({
          token: token,
          userId: payload.userId,
          exp: payload.exp,
          iat: payload.iat,
        });

        await this.device.addDeviceId(payload.userId, deviceId);
      }

      if (data.body.useCase === "CHANGE_EMAIL") {
        const userId = res.locals.userId;
        const currentEmail = data.body.email;
        const newEmail = data.body.newEmail;

        if (!currentEmail || !newEmail)
          throw new CustomError(
            "missing-inputs",
            "Missing currentEmail and newEmail in request body."
          );

        if (currentEmail === newEmail) {
          throw new CustomError(
            "user-modification-denied",
            `User can not change its email when it's the same.`
          );
        }

        const emailExist = await this.service.getUserByEmail(newEmail);

        if (emailExist) {
          throw new CustomError(
            "user-already-exist",
            "A user in our platform is already using this email."
          );
        }

        const user = await this.service.getUser(userId);

        if (user.authenticatedAs !== "LOCAL") {
          throw new CustomError(
            "user-modification-denied",
            `User can not request to change an email due to authenticating as ${user.authenticatedAs}. We're sorry for the inconvenience.`
          );
        }

        const updateable = await this.logs.updateable(userId, "UPDATE_EMAIL");

        if (!updateable) throw new CustomError("user-modification-denied");

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

      return res.status(errObj.status).json(errObj);
    }
  }

  async onEmailChange(req: Request, res: Response) {
    try {
      const token = req.body.token as string;

      if (!token) throw new CustomError("missing-inputs");

      const payload = this.auth.decodeToken(token, "EMAIL_CHANGE");

      const onTheList = await this.blacklisted.isBlacklisted(payload.userId, token);

      if (onTheList) throw new CustomError("request-already-used");

      const isValid = this.auth.verifyToken(token, "EMAIL_CHANGE");

      if (!isValid) throw new CustomError("request-expired");

      const updateable = await this.logs.updateable(payload.userId, "UPDATE_EMAIL");

      if (!updateable) throw new CustomError("user-modification-denied");

      await this.service.updateEmail(payload.userId, payload.oldEmail, payload.newEmail);

      await this.logs.addLog(payload.userId, "UPDATE_EMAIL");

      await this.blacklisted.addTokenToBlacklist({ token, ...payload });

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

      await this.service.signOutAll(payload.userId);

      return res.status(200).json(FormatResponse({}));
    } catch (err) {
      const errObj = identifyErrors(err);

      return res.status(errObj.status).json(errObj);
    }
  }

  async onGetUserByEmail(req: Request, res: Response) {
    try {
      const email: string = req.body.email;
      const useCase: GetUserByEmailUseCase = req.body.useCase;

      const token = req.body.token as string;

      if (useCase === "VERIFY_EMAIL_BY_TOKEN") {
        if (!token) throw new CustomError("missing-inputs", "Token is required in the body");

        const payload = this.auth.decodeToken(token, "EMAIL_VERIFY");

        const data = await this.service.getUserByEmail(payload.email);

        if (!data) throw new CustomError("does-not-exist", "User does not exist");

        if (data.emailVerifiedAt) throw new CustomError("user-already-verified");

        const emailVerficationToken = this.auth.createToken(
          {
            email: payload.email,
            userId: payload.userId,
          },
          "EMAIL_VERIFY"
        );

        await this.emailService.sendEmailVerification({
          clientRoute: CLIENT_ROUTES.EMAIL_VERIFICATION,
          emailToSend: payload.email,
          token: emailVerficationToken,
        });

        return res.status(200).json(FormatResponse({}));
      }

      if (useCase === "VERIFY_EMAIL") {
        if (!email) throw new CustomError("missing-inputs", "Email is required in the body.");

        const data = await this.service.getUserByEmail(email);

        if (!data) throw new CustomError("does-not-exist", "User does not exist");

        if (data.emailVerifiedAt) throw new CustomError("user-already-verified");

        const emailVerficationToken = this.auth.createToken(
          {
            email: data.email,
            userId: data.userId,
          },
          "EMAIL_VERIFY"
        );

        await this.emailService.sendEmailVerification({
          clientRoute: CLIENT_ROUTES.EMAIL_VERIFICATION,
          emailToSend: data.email,
          token: emailVerficationToken,
        });

        return res.status(200).json(FormatResponse({}, "Email verification sent."));
      }

      return res.status(200).json(FormatResponse({}));
    } catch (err) {
      const errObj = identifyErrors(err);

      return res.status(errObj.status).json(errObj);
    }
  }

  async onResetPasswordReq(req: Request, res: Response) {
    try {
      const email: string = req.body.email;

      const data = await this.service.getUserByEmail(email);

      if (!data) throw new CustomError("does-not-exist", "User does not exist");

      const passwordResetToken = this.auth.createToken({ userId: data.userId }, "RESET_PASS");

      await this.emailService.sendResetPassword({
        clientRoute: CLIENT_ROUTES.RESET_PASSWORD,
        emailToSend: data.email,
        token: passwordResetToken,
      });

      return res.status(200).json(FormatResponse({}, "Password reset request sent"));
    } catch (err) {
      const errObj = identifyErrors(err);

      return res.status(errObj.status).json(errObj);
    }
  }

  async onDeleteUser(req: Request, res: Response) {
    try {
      const userId = res.locals.userId;
      const password = req.body.password as string | undefined;

      const user = await this.service.getUser(userId);

      if (user.authenticatedAs !== "LOCAL") {
        const token = this.auth.createToken({ userId: user.userId }, "USER_DELETION_VERIFY");

        await this.emailService.sendUserDeletionVerification({
          clientRoute: CLIENT_ROUTES.USER_DELETION,
          emailToSend: user.email,
          token: token,
        });

        return res.status(200).json(FormatResponse({}, "User Deletion Verification sent"));
      }

      await this.#deleteUser(res, user.userId, password);
    } catch (err) {
      const errObj = identifyErrors(err);

      return res.status(errObj.status).json(errObj);
    }
  }

  async onDeleteUserOAuth(req: Request, res: Response) {
    try {
      const userId = res.locals.userId;
      const token = req.body.token as string;

      if (!token) throw new CustomError("missing-inputs");

      const isValid = this.auth.verifyToken(token, "USER_DELETION_VERIFY");

      if (!isValid) throw new CustomError("request-expired");

      const user = await this.service.getUser(userId);

      if (user.authenticatedAs === "LOCAL") throw new CustomError("user-not-authorized");

      await this.#deleteUser(res, user.userId);
    } catch (err) {
      const errObj = identifyErrors(err);

      return res.status(errObj.status).json(errObj);
    }
  }

  async #deleteUser(res: Response, userId: string, password?: string) {
    const images = await this.service.deleteUser(userId, password);

    await this.mediaService.removeUserDirectory(userId, images);

    return res.status(200).json(FormatResponse({}));
  }
}
