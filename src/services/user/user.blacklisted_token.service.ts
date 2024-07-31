import { inject, injectable } from "inversify";
import {
  AddBlacklistedTokenParams,
  IUserBlacklistedToken,
  IUserBlacklistedTokenRepository,
  IUserBlacklistedTokenService,
} from "../../interfaces/user/user.blacklisted_token.interface";
import { TYPES } from "../../constants";

@injectable()
export class UserBlacklistedTokenService implements IUserBlacklistedTokenService {
  private entity: IUserBlacklistedToken;
  private repo: IUserBlacklistedTokenRepository;

  constructor(
    @inject(TYPES.UserBlacklistedToken) entity: IUserBlacklistedToken,
    @inject(TYPES.UserBlacklistedTokenRepository) repo: IUserBlacklistedTokenRepository
  ) {
    this.entity = entity;
    this.repo = repo;
  }

  async addTokenToBlacklist(params: AddBlacklistedTokenParams): Promise<void> {
    const createdAt = this.entity.convertNumberToDate(params.iat);
    const expiresAt = this.entity.convertNumberToDate(params.exp);

    await this.repo.create({
      ...params,
      createdAt,
      expiresAt,
    });
  }

  async isBlacklisted(userId: string, tokenToCheck: string): Promise<boolean> {
    const data = await this.repo.get(userId, tokenToCheck);

    if (!data) return false;

    return true;
  }

  async deletedBlacklistedToken(tokenId: string): Promise<void> {
    await this.repo.deleteToken(tokenId);
  }

  async clearExpiredTokens(): Promise<void> {
    const blacklistedTokens = await this.repo.getAll();

    const expiredTokens: string[] = [];

    for (let i = 0; i < blacklistedTokens.length; i++) {
      if (!this.entity.isValid(blacklistedTokens[i].expiresAt)) {
        expiredTokens.push(blacklistedTokens[i].token);
      }
    }

    await this.repo.deleteExpiredTokens(expiredTokens);
  }
}
