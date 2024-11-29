import { injectable } from "inversify";
import { IUserSession } from "../../ts/interfaces/user/user.session.interface";
import { UserSessionData } from "../../ts/types/user/user.session.types";
import { CustomError } from "../../utils/error_handler";

@injectable()
export class UserSession implements IUserSession {
  sessionId!: string;
  userId!: string;
  refreshToken!: string;
  createdAt!: Date;
  expiresAt!: Date;

  getSession = () => {
    const obj: UserSessionData = {
      sessionId: this.sessionId,
      userId: this.userId,
      refreshToken: this.refreshToken,
      createdAt: this.createdAt,
      expiresAt: this.expiresAt,
    };

    return obj;
  };

  getSessionId = () => this.sessionId;

  getUserId = () => this.userId;

  getRefreshToken = () => this.refreshToken;

  getCreatedAt = () => this.createdAt;

  getExpiresAt = () => this.expiresAt;

  setSession = (data: UserSessionData) => {
    this.setSessionId(data.sessionId);
    this.setUserId(data.userId);
    this.setRefreshToken(data.refreshToken);
    this.setCreatedAt(data.createdAt);
    this.setExpiresAt(data.expiresAt);
  };

  setSessionId = (sessionId: string) => {
    this.sessionId = sessionId;
  };

  setUserId = (userId: string) => {
    this.userId = userId;
  };

  setRefreshToken = (refreshToken: string) => {
    this.refreshToken = refreshToken;
  };

  setCreatedAt = (date: Date) => {
    this.createdAt = date;
  };

  setExpiresAt = (date: Date) => {
    this.expiresAt = date;
  };

  isSessionExpired = (date: Date): boolean => {
    const now = Date.now();
    const expiration = date.getTime();

    return expiration <= now;
  };

  convertNumberToDate = (time?: number) => {
    if (!time)
      throw new CustomError(
        "internal-server-error",
        "An iat/exp does not exist in the token payload",
        500,
        "UserSessionModel"
      );

    const date = new Date(time * 1000);

    return date;
  };
}
