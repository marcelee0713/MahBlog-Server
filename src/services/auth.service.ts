import jwt from "jsonwebtoken";
import { IAuthService } from "../interfaces/auth.interface";
import { PayloadType, SessionType } from "../types/user/user.session.types";
import { injectable } from "inversify";
import { TOKENS_LIFESPAN } from "../constants";
import { ErrorType } from "../types";

@injectable()
export class AuthService implements IAuthService {
  private jwtClient: typeof jwt;
  private refreshSecret: string;
  private accessSecret: string;
  private emailChangeSecret: string;
  private emailVerifySecret: string;
  private passResetSecret: string;

  constructor() {
    this.jwtClient = jwt;
    this.refreshSecret = process.env.REFRESH_TOKEN_SECRETKEY as string;
    this.accessSecret = process.env.ACCESS_TOKEN_SECRETKEY as string;
    this.emailChangeSecret = process.env.EMAIL_CHANGE_SECRETKEY as string;
    this.emailVerifySecret = process.env.EMAIL_VERIFICATION_SECRETKEY as string;
    this.passResetSecret = process.env.SECRET_EMAIL_PASSWORD as string;
  }

  createToken<T extends SessionType>(payload: PayloadType<T>, type: T): string {
    switch (type) {
      case "ACCESS": {
        const token = this.jwtClient.sign(payload as PayloadType<T>, this.accessSecret, {
          expiresIn: TOKENS_LIFESPAN.ACCESS,
        });

        return token;
      }

      case "REFRESH": {
        const token = this.jwtClient.sign(payload as PayloadType<T>, this.refreshSecret, {
          expiresIn: TOKENS_LIFESPAN.REFRESH,
        });

        return token;
      }

      case "EMAIL_CHANGE": {
        const token = this.jwtClient.sign(payload as PayloadType<T>, this.emailChangeSecret, {
          expiresIn: TOKENS_LIFESPAN.EMAIL_CHANGE,
        });

        return token;
      }

      case "EMAIL_VERIFY": {
        const token = this.jwtClient.sign(payload as PayloadType<T>, this.emailVerifySecret, {
          expiresIn: TOKENS_LIFESPAN.EMAIL_VERIFY,
        });

        return token;
      }

      case "PASS_RESET": {
        const token = this.jwtClient.sign(payload as PayloadType<T>, this.passResetSecret, {
          expiresIn: TOKENS_LIFESPAN.PASS_RESET,
        });

        return token;
      }

      default:
        throw new Error("internal-server-error" as ErrorType);
    }
  }

  verifyToken<T extends SessionType>(token: string, type: T): boolean {
    try {
      switch (type) {
        case "ACCESS":
          this.jwtClient.verify(token, this.accessSecret);
          break;

        case "REFRESH":
          this.jwtClient.verify(token, this.refreshSecret);
          break;

        case "EMAIL_CHANGE":
          this.jwtClient.verify(token, this.emailChangeSecret);
          break;

        case "EMAIL_VERIFY":
          this.jwtClient.verify(token, this.emailVerifySecret);
          break;

        case "PASS_RESET":
          this.jwtClient.verify(token, this.passResetSecret);
          break;

        default:
          throw new Error("internal-server-error" as ErrorType);
      }

      return true;
    } catch (err) {
      return false;
    }
  }

  decodeToken<T extends SessionType>(token: string, type: T): PayloadType<T> {
    switch (type) {
      case "ACCESS":
        return this.jwtClient.decode(token) as PayloadType<T>;

      case "REFRESH":
        return this.jwtClient.decode(token) as PayloadType<T>;

      case "EMAIL_CHANGE":
        return this.jwtClient.decode(token) as PayloadType<T>;

      case "EMAIL_VERIFY":
        return this.jwtClient.decode(token) as PayloadType<T>;

      case "PASS_RESET":
        return this.jwtClient.decode(token) as PayloadType<T>;

      default:
        throw new Error("internal-server-error" as ErrorType);
    }
  }
}
