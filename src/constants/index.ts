export const TYPES = {
  UserModel: Symbol.for("UserModel"),
  UserService: Symbol.for("UserService"),
  UserRepository: Symbol.for("UserRepository"),
  UserController: Symbol.for("UserController"),
  UserProfileModel: Symbol.for("UserProfileModel"),
  UserSessionModel: Symbol.for("UserSessionModel"),
  UserSessionService: Symbol.for("UserSessionService"),
  UserSessionRepository: Symbol.for("UserSessionRepository"),
  AuthService: Symbol.for("AuthService"),
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
