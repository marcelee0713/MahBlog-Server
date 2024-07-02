import { inject, injectable } from "inversify";
import {
  IUserSession,
  IUserSessionRepository,
  IUserSessionService,
} from "../../interfaces/user/user.session.interface";
import { IAuthService } from "../../interfaces/auth.interface";
import { TYPES } from "../../constants";
import { generateSessionId } from "../../utils/session_id_generator";
import { returnError } from "../../utils/error_handler";

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
    try {
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
    } catch (err) {
      throw new Error(returnError(err));
    }
  }

  deleteSession = (userId: string, sessionId: string): Promise<void> => {
    throw Error("Not implemented");
  };
}
