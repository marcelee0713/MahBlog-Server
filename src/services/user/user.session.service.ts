import { inject, injectable } from "inversify";
import {
  IUserSession,
  IUserSessionRepository,
  IUserSessionService,
} from "../../interfaces/user/user.session.interface";
import { IAuthService } from "../../interfaces/auth.interface";
import { TYPES } from "../../constants";
import { generateSessionId } from "../../utils/session_id_generator";

@injectable()
export class UserSessionService implements IUserSessionService {
  private entity: IUserSession;
  private repo: IUserSessionRepository;
  private auth: IAuthService;

  constructor(
    @inject(TYPES.UserSessionModel) entity: IUserSession,
    @inject(TYPES.AuthService) auth: IAuthService,
    @inject(TYPES.UserSessionRepository) repo: IUserSessionRepository
  ) {
    this.entity = entity;
    this.auth = auth;
    this.repo = repo;
  }

  async createSession(userId: string): Promise<string> {
    const sessionId = generateSessionId();

    const token = this.auth.createToken(
      {
        userId: userId,
        sessionId: sessionId,
      },
      "REFRESH"
    );

    const payload = this.auth.decodeToken(token, "REFRESH");

    const iat = this.entity.convertNumberToDate(payload.iat);

    const exp = this.entity.convertNumberToDate(payload.exp);

    await this.repo.create({
      ...payload,
      refreshToken: token,
      createdAt: iat,
      expiresAt: exp,
    });

    const accessToken = this.auth.createToken(
      {
        userId: userId,
        sessionId: sessionId,
      },
      "ACCESS"
    );

    return accessToken;
  }

  async getSession(userId: string, sessionId: string): Promise<string> {
    const session = await this.repo.get(userId, sessionId);

    return session.refreshToken;
  }

  async deleteSession(userId: string, sessionId: string): Promise<void> {
    await this.repo.delete(userId, sessionId);
  }

  async deleteSessions(userId: string): Promise<void> {
    await this.repo.deleteAll(userId);
  }
}
