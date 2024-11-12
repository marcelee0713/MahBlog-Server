import rateLimit from "express-rate-limit";

export const createNotificationRateLimit = rateLimit({
  windowMs: 60 * 1000 * 15,
  limit: 50,
  standardHeaders: true,
  legacyHeaders: false,
});

export const updateNotificationRateLimit = rateLimit({
  windowMs: 60 * 1000 * 15,
  limit: 40,
  standardHeaders: true,
  legacyHeaders: false,
});

export const getNotificationsRateLimit = rateLimit({
  windowMs: 60 * 1000,
  limit: 15,
  standardHeaders: true,
  legacyHeaders: false,
});

export const deleteNotificationRateLimit = rateLimit({
  windowMs: 60 * 1000 * 15,
  limit: 50,
  standardHeaders: true,
  legacyHeaders: false,
});

export const getNotificationCountRateLimit = rateLimit({
  windowMs: 60 * 1000,
  limit: 25,
  standardHeaders: true,
  legacyHeaders: false,
});
