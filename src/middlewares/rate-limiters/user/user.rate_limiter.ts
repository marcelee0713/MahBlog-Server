import rateLimit from "express-rate-limit";

export const createUserRateLimit = rateLimit({
  windowMs: 60 * 1000 * 15,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

export const getUserRateLimit = rateLimit({
  windowMs: 60 * 1000,
  limit: 45,
  standardHeaders: true,
  legacyHeaders: false,
});

export const signInAndOutRateLimit = rateLimit({
  windowMs: 60 * 1000 * 5,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  skipFailedRequests: true,
});

export const emailAndPassReqRateLimit = rateLimit({
  windowMs: 60 * 1000 * 30,
  limit: 2,
  standardHeaders: true,
  legacyHeaders: false,
  skipFailedRequests: true,
});

export const updateUserRateLimit = rateLimit({
  windowMs: 60 * 1000 * 15,
  limit: 13,
  standardHeaders: true,
  legacyHeaders: false,
});

export const deleteUserRateLimit = rateLimit({
  windowMs: 60 * 1000 * 10,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
});
