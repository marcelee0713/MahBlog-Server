import { ExcludeFunctions } from "..";
import {
  AddBlacklistedTokenParams,
  IUserBlacklistedToken,
} from "../../interfaces/user/user.blacklisted_token.interface";

export type UserBlacklistedTokenData = ExcludeFunctions<IUserBlacklistedToken>;

export type UserBlackListedAddRepoParams = Omit<AddBlacklistedTokenParams, "iat" | "exp"> & {
  createdAt: Date;
  expiresAt: Date;
};
