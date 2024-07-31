import {
  UserBlackListedAddRepoParams,
  UserBlacklistedTokenData,
} from "../../types/user/user.blacklisted_tokens.types";

export interface IUserBlacklistedToken {
  token: string;
  holderId: string;
  createdAt: Date;
  expiresAt: Date;

  getToken: () => string;
  getHolderId: () => string;
  getCreatedAt: () => Date;
  getExpiresAt: () => Date;
  setToken: (token: string) => void;
  setHolderId: (holderId: string) => void;
  setCreatedAt: (date: Date) => void;
  setExpiresAt: (date: Date) => void;

  isValid(expirationDate: Date): boolean;
  convertNumberToDate: (time?: number) => Date;
}

export interface IUserBlacklistedTokenService {
  addTokenToBlacklist(params: AddBlacklistedTokenParams): Promise<void>;
  isBlacklisted(userId: string, tokenToCheck: string): Promise<boolean>;
  deletedBlacklistedToken(tokenId: string): Promise<void>;
  clearExpiredTokens(): Promise<void>;
}

export interface IUserBlacklistedTokenRepository {
  create(data: UserBlackListedAddRepoParams): Promise<void>;
  get(userId: string, token: string): Promise<UserBlacklistedTokenData | null>;
  getAll(userId?: string): Promise<UserBlacklistedTokenData[]>;
  deleteToken(token: string): Promise<void>;
  deleteExpiredTokens(tokens: string[]): Promise<void>;
}

export interface AddBlacklistedTokenParams {
  userId: string;
  token: string;
  iat?: number;
  exp?: number;
}
