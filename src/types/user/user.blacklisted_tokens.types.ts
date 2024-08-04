import { ExcludeFunctions } from "..";
import {
  CreateBlacklistedTokenParams,
  IUserBlacklistedToken,
} from "../../interfaces/user/user.blacklisted_token.interface";

export type UserBlacklistedTokenData = ExcludeFunctions<IUserBlacklistedToken>;

export type CreateUserBlackListedRepoParams = Omit<CreateBlacklistedTokenParams, "iat" | "exp"> & {
  createdAt: Date;
  expiresAt: Date;
};
