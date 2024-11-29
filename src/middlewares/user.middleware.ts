import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import { IUserSessionService } from "../ts/interfaces/user/user.session.interface";
import { TYPES } from "../constants";
import { IAuthService } from "../ts/interfaces/auth.interface";
import { bodyError, CustomError, identifyErrors } from "../utils/error_handler";
import { AnyZodObject, z } from "zod";
import { upload } from "../config/multer";
import { safeExecute } from "../utils";
import { FormatResponse } from "../utils/response_handler";

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
        throw new CustomError("authorization-header-missing");
      }

      const token = authHeader.split(" ")[1];

      if (!token) throw new CustomError("user-not-authorized");

      const payload = this.auth.decodeToken(token, "ACCESS");

      const isAccesTokenValid = this.auth.verifyToken(token, "ACCESS");

      res.locals.token = token;
      res.locals.userId = payload.userId;

      if (isAccesTokenValid) return next();

      const refreshToken = await this.session.getSession(payload.userId, payload.sessionId);

      const isRefreshTokenValid = this.auth.verifyToken(refreshToken, "REFRESH");

      if (!isRefreshTokenValid) {
        await this.session.deleteSession(payload.userId, payload.sessionId);

        throw new CustomError("user-session-expired");
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

      return res.status(errObj.status).json(errObj);
    }
  }

  async validateCurrentSession(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers["authorization"];

      if (!authHeader || !authHeader.startsWith("Bearer ")) return next();

      const token = authHeader.split(" ")[1];

      const isAccesTokenValid = await safeExecute(
        this.auth.verifyToken.bind(this.auth),
        token,
        "ACCESS"
      );

      if (isAccesTokenValid === null) return next();

      return res.status(303).json(FormatResponse({}, "User already logged-in", 303));
    } catch (err) {
      const errObj = identifyErrors(err);

      return res.status(errObj.status).json(errObj);
    }
  }

  async handleGoogleCallback(req: Request, res: Response, next: NextFunction) {
    const url = process.env.GOOGLE_OAUTH_URL as string;

    try {
      if (req.query.error === "access_denied") return res.redirect(url);

      return next();
    } catch (err) {
      const errObj = identifyErrors(err);

      return res.status(errObj.status).json(errObj);
    }
  }

  validateBody(schema: AnyZodObject) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        await schema.parseAsync({
          body: req.body,
        });
        return next();
      } catch (err) {
        if (err instanceof z.ZodError) {
          return res.status(400).json(bodyError(err));
        }

        return res.status(500).json({ error: "Internal server error" });
      }
    };
  }

  validateMulter(name: string) {
    return (req: Request, res: Response, next: NextFunction) => {
      upload.single(name)(req, res, (err: unknown) => {
        if (err) {
          const errObj = identifyErrors(new CustomError("invalid-image-upload"));
          return res.status(errObj.status).json(errObj);
        }

        next();
      });
    };
  }
}
