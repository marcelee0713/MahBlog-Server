import { Container } from "inversify";
import { IUser, IUserRepository, IUserService } from "../ts/interfaces/user/user.interface";
import { TYPES } from "../constants";
import { User } from "../models/user/user.model";
import { UserService } from "../services/user/user.service";
import { UserRepository } from "../repositories/user/user.repo";
import { UserController } from "../controllers/user/user.controller";
import {
  IUserProfile,
  IUserProfileRepository,
  IUserProfileService,
} from "../ts/interfaces/user/user.profile.interface";
import { UserProfile } from "../models/user/user.profile.model";
import {
  IUserSession,
  IUserSessionRepository,
  IUserSessionService,
} from "../ts/interfaces/user/user.session.interface";
import { UserSession } from "../models/user/user.session.model";
import { UserSessionService } from "../services/user/user.session.service";
import { UserSessionRepository } from "../repositories/user/user.session.repo";
import { IAuthService } from "../ts/interfaces/auth.interface";
import { AuthService } from "../services/auth.service";
import { UserMiddleware } from "../middlewares/user.middleware";
import { IEmailService } from "../ts/interfaces/email.interface";
import { EmailService } from "../services/email.service";
import {
  IUserBlacklistedToken,
  IUserBlacklistedTokenRepository,
  IUserBlacklistedTokenService,
} from "../ts/interfaces/user/user.blacklisted_token.interface";
import { UserBlacklistedToken } from "../models/user/user.blacklisted_token.model";
import { UserBlacklistedTokenService } from "../services/user/user.blacklisted_token.service";
import { UserBlacklistedTokenRepository } from "../repositories/user/user.blacklisted_tokens.repo";
import {
  IUserLogs,
  IUserLogsRepository,
  IUserLogsService,
} from "../ts/interfaces/user/user.logs.interface";
import { UserLogs } from "../models/user/user.logs.model";
import { UserLogsService } from "../services/user/user.logs.service";
import { UserLogsRepository } from "../repositories/user/user.logs.repo";
import { IMediaService } from "../ts/interfaces/media.interface";
import { MediaService } from "../services/media.service";
import { UserProfileService } from "../services/user/user.profile.service";
import { UserProfileRepository } from "../repositories/user/user.profile.repo";
import { UserProfileController } from "../controllers/user/user.profile.controller";
import {
  IUserReports,
  IUserReportsRepository,
  IUserReportsService,
} from "../ts/interfaces/user/user.reports.interface";
import { UserReports } from "../models/user/user.reports.model";
import { UserReportsService } from "../services/user/user.reports.service";
import { UserReportsRepository } from "../repositories/user/user.reports.repo";
import { UserReportsController } from "../controllers/user/user.reports.controller";
import {
  IUserConnectionRepository,
  IUserConnectionsService,
} from "../ts/interfaces/user/user.connections.interface";
import { UserConnectionsService } from "../services/user/user.connections.service";
import { UserConnectionsRepository } from "../repositories/user/user.connections.repo";
import { UserConnectionsController } from "../controllers/user/user.connections.controller";
import { Blog } from "../models/blog/blog.model";
import { IBlog, IBlogRepository, IBlogService } from "../ts/interfaces/blog/blog.interface";
import { BlogService } from "../services/blog/blog.service";
import { BlogRepository } from "../repositories/blog/blog.repo";
import { BlogController } from "../controllers/blog/blog.controller";
import {
  IBlogContents,
  IBlogContentsRepository,
  IBlogContentsService,
} from "../ts/interfaces/blog/blog.contents.interface";
import { BlogContents } from "../models/blog/blog.contents.model";
import { BlogContentsService } from "../services/blog/blog.contents.service";
import { BlogContentsRepository } from "../repositories/blog/blog.contents.repo";
import { BlogContentsController } from "../controllers/blog/blog.contents.controller";
import { IBlogScores, IBlogScoresRepository } from "../ts/interfaces/blog/blog.scores.interface";
import { BlogScores } from "../models/blog/blog.scores.model";
import { BlogScoresRepository } from "../repositories/blog/blog.scores.repo";
import {
  IBlogCommentsRepository,
  IBlogCommentsService,
} from "../ts/interfaces/blog/blog.comments.interface";
import { BlogCommentsService } from "../services/blog/blog.comments.service";
import { BlogCommentsRepository } from "../repositories/blog/blog.comments.repo";
import { BlogCommentsController } from "../controllers/blog/blog.comments.controller";
import { ILikesRepository } from "../ts/interfaces/blog/blog.likes.interface";
import { LikesRepository } from "../repositories/blog/likes.repo";
import {
  IBlogCommentRepliesRepository,
  IBlogCommentRepliesService,
} from "../ts/interfaces/blog/blog.comments.replies.interface";
import { BlogCommentRepliesRepository } from "../repositories/blog/blog.comments.replies.repo";
import { BlogCommentRepliesService } from "../services/blog/blog.comment.replies.service";
import { BlogCommentRepliesController } from "../controllers/blog/blog.comment.replies.controller";
import { PassportService } from "../middlewares/passport.middleware";
import {
  IUserNotificationsRepository,
  IUserNotificationsService,
} from "../ts/interfaces/user/user.notifications.interface";
import { UserNotificationsService } from "../services/user/user.notifications.service";
import { UserNotificationsRepository } from "../repositories/user/user.notifications.repo";
import { UserNotificationsController } from "../controllers/user/user.notifications.controller";
import {
  IDeviceVerificationsRepository,
  IUserDevices,
  IUserDevicesRepository,
  IUserDevicesService,
} from "../ts/interfaces/user/user.devices.interface";
import { UserDevices } from "../models/user/user.devices.model";
import { UserDevicesService } from "../services/user/user.devices.service";
import { UserDevicesRepository } from "../repositories/user/user.devices.repo";
import { UserDevicesController } from "../controllers/user/user.devices.controller";
import { DeviceVerificationsRepository } from "../repositories/device-verification.repo";

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

container.bind<IUserBlacklistedToken>(TYPES.UserBlacklistedTokenModel).to(UserBlacklistedToken);
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

container
  .bind<IUserNotificationsService>(TYPES.UserNotificationsService)
  .to(UserNotificationsService);
container
  .bind<IUserNotificationsRepository>(TYPES.UserNotificationsRepository)
  .to(UserNotificationsRepository);
container.bind(TYPES.UserNotificationsController).to(UserNotificationsController);

container.bind<IUserDevices>(TYPES.UserDevicesModel).to(UserDevices);
container.bind<IUserDevicesService>(TYPES.UserDevicesService).to(UserDevicesService);
container.bind<IUserDevicesRepository>(TYPES.UserDevicesRepository).to(UserDevicesRepository);
container.bind(TYPES.UserDevicesController).to(UserDevicesController);
container
  .bind<IDeviceVerificationsRepository>(TYPES.DeviceVerificationsRepository)
  .to(DeviceVerificationsRepository);

container.bind(TYPES.UserMiddleware).to(UserMiddleware);

container.bind<IBlog>(TYPES.BlogModel).to(Blog);
container.bind<IBlogService>(TYPES.BlogService).to(BlogService);
container.bind<IBlogRepository>(TYPES.BlogRepository).to(BlogRepository);
container.bind(TYPES.BlogController).to(BlogController);

container.bind<IBlogContents>(TYPES.BlogContentsModel).to(BlogContents);
container.bind<IBlogContentsService>(TYPES.BlogContentsService).to(BlogContentsService);
container.bind<IBlogContentsRepository>(TYPES.BlogContentsRepository).to(BlogContentsRepository);
container.bind(TYPES.BlogContentsController).to(BlogContentsController);

container.bind<IBlogScores>(TYPES.BlogScoresModel).to(BlogScores);
container.bind<IBlogScoresRepository>(TYPES.BlogScoresRepository).to(BlogScoresRepository);

container.bind<IBlogCommentsService>(TYPES.BlogCommentsService).to(BlogCommentsService);
container.bind<IBlogCommentsRepository>(TYPES.BlogCommentsRepository).to(BlogCommentsRepository);
container.bind(TYPES.BlogCommentsController).to(BlogCommentsController);

container
  .bind<IBlogCommentRepliesService>(TYPES.BlogCommentRepliesService)
  .to(BlogCommentRepliesService);
container
  .bind<IBlogCommentRepliesRepository>(TYPES.BlogCommentRepliesRepository)
  .to(BlogCommentRepliesRepository);
container.bind(TYPES.BlogCommentRepliesController).to(BlogCommentRepliesController);

container.bind<ILikesRepository>(TYPES.LikesRepository).to(LikesRepository);

container.bind<IAuthService>(TYPES.AuthService).to(AuthService);
container.bind<IEmailService>(TYPES.EmailService).to(EmailService);
container.bind<IMediaService>(TYPES.MediaService).to(MediaService);
container.bind(TYPES.PassportService).to(PassportService);
