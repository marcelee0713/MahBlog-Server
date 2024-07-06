import { Container } from "inversify";
import { IUser, IUserRepository, IUserService } from "../interfaces/user/user.interface";
import { TYPES } from "../constants";
import { User } from "../models/user/user.model";
import { UserService } from "../services/user/user.service";
import { UserRepository } from "../repositories/user.repo";
import { UserController } from "../controllers/user.controller";
import { IUserProfile } from "../interfaces/user/user.profile.interface";
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

export const container = new Container();

// User
container.bind<IUser>(TYPES.UserModel).to(User);
container.bind<IUserService>(TYPES.UserService).to(UserService);
container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);
container.bind(TYPES.UserController).to(UserController);

// User Profile
container.bind<IUserProfile>(TYPES.UserProfileModel).to(UserProfile);

// User Session
container.bind<IUserSession>(TYPES.UserSessionModel).to(UserSession);
container.bind<IUserSessionService>(TYPES.UserSessionService).to(UserSessionService);
container.bind<IUserSessionRepository>(TYPES.UserSessionRepository).to(UserSessionRepository);

// User Blacklisted tokens
container.bind<IUserBlacklistedToken>(TYPES.UserBlacklistedToken).to(UserBlacklistedToken);
container
  .bind<IUserBlacklistedTokenService>(TYPES.UserBlacklistedTokenService)
  .to(UserBlacklistedTokenService);
container
  .bind<IUserBlacklistedTokenRepository>(TYPES.UserBlacklistedTokenRepository)
  .to(UserBlacklistedTokenRepository);

// External Services
container.bind<IAuthService>(TYPES.AuthService).to(AuthService);
container.bind<IEmailService>(TYPES.EmailService).to(EmailService);

// User Middleware
container.bind(TYPES.UserMiddleware).to(UserMiddleware);
