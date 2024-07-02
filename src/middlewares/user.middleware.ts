import { Request, Response, NextFunction } from "express";
import { ErrorType } from "../types";
import { inject, injectable } from "inversify";
import { IUserSessionService } from "../interfaces/user/user.session.interface";
import { TYPES } from "../constants";
import { IAuthService } from "../interfaces/auth.interface";
import { identifyErrors } from "../utils/error_handler";

@injectable()
export class UserMiddleware {
  private session: IUserSessionService;
  private auth: IAuthService;

  constructor(
    @inject(TYPES.UserSessionService) session: IUserSessionService,
    @inject(TYPES.AuthService) auth: IAuthService
  ) {
    this.session = session;
    this.auth = auth;
  }

  async verifySession(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers["authorization"];

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new Error("authorization-header-missing" as ErrorType);
      }

      const token = authHeader.split(" ")[1];

      const payload = this.auth.decodeToken(token, "ACCESS");

      const isAccesTokenValid = this.auth.verifyToken(token, "ACCESS");

      res.locals.token = token;
      res.locals.userId = payload.userId;

      if (isAccesTokenValid) return next();

      const refreshToken = await this.session.getSession(payload.userId, payload.sessionId);

      const isRefreshTokenValid = this.auth.verifyToken(refreshToken, "REFRESH");

      if (!isRefreshTokenValid) {
        await this.session.deleteSession(payload.userId, payload.sessionId);

        throw new Error("user-session-expired" as ErrorType);
      }

      const rPayload = this.auth.decodeToken(refreshToken, "REFRESH");

      const newToken = this.auth.createToken(
        {
          userId: rPayload.userId,
          sessionId: rPayload.sessionId,
        },
        "ACCESS"
      );

      res.locals.token = newToken;
      res.locals.userId = rPayload.userId;

      return next();
    } catch (err) {
      const errObj = identifyErrors(err);

      return res.status(errObj.code).json(errObj);
    }
  }
}
