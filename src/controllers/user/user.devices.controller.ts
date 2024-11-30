import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { IUserDevicesService } from "../../ts/interfaces/user/user.devices.interface";
import { TYPES } from "../../constants";
import { CustomError, identifyErrors } from "../../utils/error_handler";
import { IAuthService } from "../../ts/interfaces/auth.interface";
import { IUserBlacklistedTokenService } from "../../ts/interfaces/user/user.blacklisted_token.interface";
import { FormatResponse } from "../../utils/response_handler";
import { IUserService } from "../../ts/interfaces/user/user.interface";

@injectable()
export class UserDevicesController {
  private userService: IUserService;
  private service: IUserDevicesService;
  private auth: IAuthService;
  private blacklisted: IUserBlacklistedTokenService;

  constructor(
    @inject(TYPES.UserService) userService: IUserService,
    @inject(TYPES.UserDevicesService) service: IUserDevicesService,
    @inject(TYPES.AuthService) auth: IAuthService,
    @inject(TYPES.UserBlacklistedTokenService) blacklisted: IUserBlacklistedTokenService
  ) {
    this.userService = userService;
    this.service = service;
    this.auth = auth;
    this.blacklisted = blacklisted;
  }

  async onSubmitVerification(req: Request, res: Response) {
    try {
      const code = req.body.code as string;

      const token = req.body.token as string;

      const deviceId = req.headers["device-id"] as string;

      if (!deviceId) throw new CustomError("device-header-missing");

      const validToken = this.auth.verifyToken(token, "DEVICE_VERIFY");

      if (!validToken) throw new CustomError("invalid", "Invalid device verification request");

      const payload = this.auth.decodeToken(token, "DEVICE_VERIFY");

      const onTheList = await this.blacklisted.isBlacklisted(payload.userId, token);

      if (onTheList) throw new CustomError("request-already-used");

      await this.service.verifyDeviceId(
        payload.userId,
        code,
        deviceId,
        payload.deviceVerificationId
      );

      await this.blacklisted.addTokenToBlacklist({
        token,
        userId: payload.userId,
        exp: payload.exp,
        iat: payload.iat,
      });

      return res.status(200).json(FormatResponse({}, `Device Verified`));
    } catch (err) {
      const errObj = identifyErrors(err);

      return res.status(errObj.status).json(errObj);
    }
  }

  async OAuthStoreDeviceID(req: Request, res: Response) {
    try {
      const userId = res.locals.userId as string;
      const deviceId = req.headers["device-id"] as string;

      if (!deviceId) throw new CustomError("device-header-missing");

      const exist = await this.service.deviceExist(userId, deviceId);

      if (exist) return res.status(200).json(FormatResponse({}, `Device already exist`));

      const user = await this.userService.getUser(userId);

      if (user.authenticatedAs === "LOCAL") throw new CustomError("user-not-authorized");

      await this.service.addDeviceId(userId, deviceId);

      return res.status(200).json(FormatResponse({}, `Device Verified`));
    } catch (err) {
      const errObj = identifyErrors(err);

      return res.status(errObj.status).json(errObj);
    }
  }
}
