import { injectable } from "inversify";
import { IUserBlacklistedToken } from "../../ts/interfaces/user/user.blacklisted_token.interface";
import { CustomError } from "../../utils/error_handler";

@injectable()
export class UserBlacklistedToken implements IUserBlacklistedToken {
  token!: string;
  holderId!: string;
  createdAt!: Date;
  expiresAt!: Date;

  getToken = () => this.token;

  getHolderId = () => this.holderId;

  getCreatedAt = () => this.createdAt;

  getExpiresAt = () => this.expiresAt;

  setToken = (token: string) => {
    this.token = token;
  };

  setHolderId = (holderId: string) => {
    this.holderId = holderId;
  };

  setCreatedAt = (date: Date) => {
    this.createdAt = date;
  };

  setExpiresAt = (date: Date) => {
    this.expiresAt = date;
  };

  // For admin use
  isValid(expirationDate: Date): boolean {
    const timeToday = new Date().getTime();
    const expirationTime = expirationDate.getTime();

    return expirationTime >= timeToday;
  }

  convertNumberToDate = (time?: number) => {
    if (!time)
      throw new CustomError(
        "internal-server-error",
        "An iat/exp does not exist in the token payload",
        500,
        "UserBlacklistedTokenModel"
      );

    const date = new Date(time * 1000);

    return date;
  };
}
