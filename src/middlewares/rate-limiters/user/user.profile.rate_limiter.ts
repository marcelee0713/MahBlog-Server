import rateLimit from "express-rate-limit";

export const getProfileRateLimitMinimized = rateLimit({
  windowMs: 60 * 1000 * 10,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
});

export const getProfileRateLimit = rateLimit({
  windowMs: 60 * 1000 * 15,
  limit: 50,
  standardHeaders: true,
  legacyHeaders: false,
});

export const updateProfileRateLimit = rateLimit({
  windowMs: 60 * 1000 * 15,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

export const removeProfileRateLimit = rateLimit({
  windowMs: 60 * 1000 * 15,
  limit: 15,
  standardHeaders: true,
  legacyHeaders: false,
});
