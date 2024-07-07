export const TYPES = {
  UserMiddleware: Symbol.for("UserMiddleware"),
  UserModel: Symbol.for("UserModel"),
  UserService: Symbol.for("UserService"),
  UserRepository: Symbol.for("UserRepository"),
  UserController: Symbol.for("UserController"),
  UserProfileModel: Symbol.for("UserProfileModel"),
  UserSessionModel: Symbol.for("UserSessionModel"),
  UserSessionService: Symbol.for("UserSessionService"),
  UserSessionRepository: Symbol.for("UserSessionRepository"),
  UserBlacklistedToken: Symbol.for("UserBlacklistedToken"),
  UserBlacklistedTokenService: Symbol.for("UserBlacklistedTokenService"),
  UserBlacklistedTokenRepository: Symbol.for("UserBlacklistedTokenRepository"),
  UserLogs: Symbol.for("UserLogs"),
  UserLogsService: Symbol.for("UserLogsService"),
  UserLogsRepository: Symbol.for("UserLogsRepository"),
  AuthService: Symbol.for("AuthService"),
  EmailService: Symbol.for("EmailService"),
};

export const REG_EX = {
  EMAIL: /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/,
  PASSWORD: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?]).{8,}$/,
};

export const TOKENS_LIFESPAN = {
  REFRESH: "30d",
  ACCESS: "10m",
  EMAIL_VERIFY: "1d",
  EMAIL_CHANGE: "1d",
  PASS_RESET: "1d",
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
  EMAIL_VERIFICATION: "/verify-email",
  RESET_PASSWORD: "/reset-password",
};
