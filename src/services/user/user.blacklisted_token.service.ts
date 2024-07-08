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

    await this.repo.add({
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
}