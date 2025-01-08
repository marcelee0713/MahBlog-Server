export const TYPES = {
  UserMiddleware: Symbol.for("UserMiddleware"),
  UserModel: Symbol.for("UserModel"),
  UserService: Symbol.for("UserService"),
  UserRepository: Symbol.for("UserRepository"),
  UserController: Symbol.for("UserController"),
  UserLogsModel: Symbol.for("UserLogsModel"),
  UserLogsService: Symbol.for("UserLogsService"),
  UserLogsRepository: Symbol.for("UserLogsRepository"),
  UserReportsModel: Symbol.for("UserReportsModel"),
  UserReportsService: Symbol.for("UserReportsService"),
  UserReportsRepository: Symbol.for("UserReportsRepository"),
  UserReportsController: Symbol.for("UserReportsController"),
  UserProfileModel: Symbol.for("UserProfileModel"),
  UserProfileService: Symbol.for("UserProfileService"),
  UserProfileRepository: Symbol.for("UserProfileRepository"),
  UserProfileController: Symbol.for("UserProfileController"),
  UserSessionModel: Symbol.for("UserSessionModel"),
  UserSessionService: Symbol.for("UserSessionService"),
  UserSessionRepository: Symbol.for("UserSessionRepository"),
  UserDevicesModel: Symbol.for("UserDevicesModel"),
  UserDevicesService: Symbol.for("UserDevicesService"),
  UserDevicesRepository: Symbol.for("UserDevicesRepository"),
  UserDevicesController: Symbol.for("UserDevicesController"),
  UserConnectionsModel: Symbol.for("UserConnectionsModel"),
  UserConnectionsService: Symbol.for("UserConnectionsService"),
  UserConnectionsRepository: Symbol.for("UserConnectionsRepository"),
  UserConnectionsController: Symbol.for("UserConnectionsController"),
  UserNotificationsService: Symbol.for("UserNotificationsService"),
  UserNotificationsRepository: Symbol.for("UserNotificationsRepository"),
  UserNotificationsController: Symbol.for("UserNotificationsController"),
  UserBlacklistedTokenModel: Symbol.for("UserBlacklistedTokenModel"),
  UserBlacklistedTokenService: Symbol.for("UserBlacklistedTokenService"),
  UserBlacklistedTokenRepository: Symbol.for("UserBlacklistedTokenRepository"),
  DeviceVerificationsRepository: Symbol.for("DeviceVerificationsRepository"),
  BlogModel: Symbol.for("BlogModel"),
  BlogService: Symbol.for("BlogService"),
  BlogRepository: Symbol.for("BlogRepository"),
  BlogController: Symbol.for("BlogController"),
  BlogLikesRepository: Symbol.for("BlogLikesRepository"),
  BlogContentsModel: Symbol.for("BlogContentsModel"),
  BlogContentsService: Symbol.for("BlogContentsService"),
  BlogContentsRepository: Symbol.for("BlogContentsRepository"),
  BlogContentsController: Symbol.for("BlogContentsController"),
  BlogScoresModel: Symbol.for("BlogScoresModel"),
  BlogScoresRepository: Symbol.for("BlogScoresRepository"),
  BlogCommentsService: Symbol.for("BlogCommentsService"),
  BlogCommentsRepository: Symbol.for("BlogCommentsRepository"),
  BlogCommentsController: Symbol.for("BlogCommentsController"),
  BlogCommentRepliesService: Symbol.for("BlogCommentRepliesService"),
  BlogCommentRepliesRepository: Symbol.for("BlogCommentRepliesRepository"),
  BlogCommentRepliesController: Symbol.for("BlogCommentRepliesController"),
  LikesRepository: Symbol.for("LikesRepository"),
  MediaService: Symbol.for("MediaService"),
  AuthService: Symbol.for("AuthService"),
  PassportService: Symbol.for("PassportService"),
  EmailService: Symbol.for("EmailService"),
};

export const REG_EX = {
  EMAIL: /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/,
  PASSWORD: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?]).{8,}$/,
};

export const TOKENS_LIFESPAN = {
  REFRESH: "30d",
  ACCESS: "10m", // TODO: Change this back when done testing
  DEVICE_VERIFY: "10m",
  EMAIL_VERIFY: "1d",
  EMAIL_CHANGE: "1d",
  PASS_RESET: "1d",
  USER_DELETION: "10m",
};

export const DEVICE_VERIFY_CONTENT = {
  NAME: "MahBlog Device Verification",
  SUBJECT: "A verification to verify your device from MahBlog.",
};

export const EMAIL_VERIFY_CONTENT = {
  NAME: "MahBlog Email Verification",
  SUBJECT: "An email verification to verify you from MahBlog.",
};

export const EMAIL_CHANGE_CONTENT = {
  NAME: "MahBlog Email Change Confirmation",
  SUBJECT: "An email to change confirmation your email address from MahBlog.",
};

export const EMAIL_RESET_PASSWORD = {
  NAME: "MahBlog Email Reset Password",
  SUBJECT: "An email for resetting your password from MahBlog.",
};

export const USER_DELETION_CONTENT = {
  NAME: "MahBlog User Deletion Verification",
  SUBJECT: "A verification for deleting your account from MahBlog.",
};

export const UPDATE_DAYS_COOLDOWN = {
  NAME_AND_EMAIL: 90,
};

export const DEFAULT_LOG_CONTENT = {
  UPDATE_EMAIL: "User update its email",
  UPDATE_PASSWORD: "User update its password",
  UPDATE_NAME: "User updated its name",
  OTHER: "User updated something unknown",
};

export const CLIENT_ROUTES = {
  EMAIL_CHANGE: "/email-change-confirmation",
  EMAIL_VERIFICATION: "/email-verification",
  RESET_PASSWORD: "/reset-password",
  DEVICE_VERIFICATION: "/device-verification",
  USER_DELETION: "/goodbye",
};
