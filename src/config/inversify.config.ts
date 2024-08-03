import { Container } from "inversify";
import { IUser, IUserRepository, IUserService } from "../interfaces/user/user.interface";
import { TYPES } from "../constants";
import { User } from "../models/user/user.model";
import { UserService } from "../services/user/user.service";
import { UserRepository } from "../repositories/user.repo";
import { UserController } from "../controllers/user.controller";
import {
  IUserProfile,
  IUserProfileRepository,
  IUserProfileService,
} from "../interfaces/user/user.profile.interface";
import { UserProfile } from "../models/user/user.profile.model";
import {
  IUserSession,
  IUserSessionRepository,
  IUserSessionService,
} from "../interfaces/user/user.session.interface";
import { UserSession } from "../models/user/user.session.model";
import { UserSessionService } from "../services/user/user.session.service";
import { UserSessionRepository } from "../repositories/user.session.repo";
import { IAuthService } from "../interfaces/auth.interface";
import { AuthService } from "../services/auth.service";
import { UserMiddleware } from "../middlewares/user.middleware";
import { IEmailService } from "../interfaces/email.interface";
import { EmailService } from "../services/email.service";
import {
  IUserBlacklistedToken,
  IUserBlacklistedTokenRepository,
  IUserBlacklistedTokenService,
} from "../interfaces/user/user.blacklisted_token.interface";
import { UserBlacklistedToken } from "../models/user/user.blacklisted_token.model";
import { UserBlacklistedTokenService } from "../services/user/user.blacklisted_token.service";
import { UserBlacklistedTokenRepository } from "../repositories/user.blacklisted_tokens.repo";
import {
  IUserLogs,
  IUserLogsRepository,
  IUserLogsService,
} from "../interfaces/user/user.logs.interface";
import { UserLogs } from "../models/user/user.logs.model";
import { UserLogsService } from "../services/user/user.logs.service";
import { UserLogsRepository } from "../repositories/user.logs.repo";
import { IMediaService } from "../interfaces/media.interface";
import { MediaService } from "../services/media.service";
import { UserProfileService } from "../services/user/user.profile.service";
import { UserProfileRepository } from "../repositories/user.profile.repo";
import { UserProfileController } from "../controllers/user.profile.controller";
import {
  IUserReports,
  IUserReportsRepository,
  IUserReportsService,
} from "../interfaces/user/user.reports.interface";
import { UserReports } from "../models/user/user.reports.model";
import { UserReportsService } from "../services/user/user.reports.service";
import { UserReportsRepository } from "../repositories/user.reports.repo";
import { UserReportsController } from "../controllers/user.reports.controller";
import {
  IUserConnectionRepository,
  IUserConnectionsService,
} from "../interfaces/user/user.connections.interface";
import { UserConnectionsService } from "../services/user/user.connections.service";
import { UserConnectionsRepository } from "../repositories/user.connections.repo";
import { UserConnectionsController } from "../controllers/user.connections.controller";

export const container = new Container();

container.bind<IUser>(TYPES.UserModel).to(User);
container.bind<IUserService>(TYPES.UserService).to(UserService);
container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);
container.bind(TYPES.UserController).to(UserController);

container.bind<IUserProfile>(TYPES.UserProfileModel).to(UserProfile);
container.bind<IUserProfileService>(TYPES.UserProfileService).to(UserProfileService);
container.bind<IUserProfileRepository>(TYPES.UserProfileRepository).to(UserProfileRepository);
container.bind(TYPES.UserProfileController).to(UserProfileController);

container.bind<IUserSession>(TYPES.UserSessionModel).to(UserSession);
container.bind<IUserSessionService>(TYPES.UserSessionService).to(UserSessionService);
container.bind<IUserSessionRepository>(TYPES.UserSessionRepository).to(UserSessionRepository);

container.bind<IUserBlacklistedToken>(TYPES.UserBlacklistedToken).to(UserBlacklistedToken);
container
  .bind<IUserBlacklistedTokenService>(TYPES.UserBlacklistedTokenService)
  .to(UserBlacklistedTokenService);
container
  .bind<IUserBlacklistedTokenRepository>(TYPES.UserBlacklistedTokenRepository)
  .to(UserBlacklistedTokenRepository);

container.bind<IUserConnectionsService>(TYPES.UserConnectionsService).to(UserConnectionsService);
container
  .bind<IUserConnectionRepository>(TYPES.UserConnectionsRepository)
  .to(UserConnectionsRepository);
container.bind(TYPES.UserConnectionsController).to(UserConnectionsController);

container.bind<IUserLogs>(TYPES.UserLogsModel).to(UserLogs);
container.bind<IUserLogsService>(TYPES.UserLogsService).to(UserLogsService);
container.bind<IUserLogsRepository>(TYPES.UserLogsRepository).to(UserLogsRepository);

container.bind<IUserReports>(TYPES.UserReportsModel).to(UserReports);
container.bind<IUserReportsService>(TYPES.UserReportsService).to(UserReportsService);
container.bind<IUserReportsRepository>(TYPES.UserReportsRepository).to(UserReportsRepository);
container.bind(TYPES.UserReportsController).to(UserReportsController);

container.bind(TYPES.UserMiddleware).to(UserMiddleware);

container.bind<IAuthService>(TYPES.AuthService).to(AuthService);
container.bind<IEmailService>(TYPES.EmailService).to(EmailService);
container.bind<IMediaService>(TYPES.MediaService).to(MediaService);
