import rateLimit from "express-rate-limit";

export const getReportRateLimit = rateLimit({
  windowMs: 60 * 1000 * 15,
  limit: 50,
  standardHeaders: true,
  legacyHeaders: false,
});

export const getReportsRateLimit = rateLimit({
  windowMs: 60 * 1000 * 15,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

export const createReportRateLimit = rateLimit({
  windowMs: 60 * 1000 * 15,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
});

export const deleteReportRateLimit = rateLimit({
  windowMs: 60 * 1000 * 15,
  limit: 50,
  standardHeaders: true,
  legacyHeaders: false,
});

export const deleteReportsRateLimit = rateLimit({
  windowMs: 60 * 1000 * 15,
  limit: 50,
  standardHeaders: true,
  legacyHeaders: false,
});
