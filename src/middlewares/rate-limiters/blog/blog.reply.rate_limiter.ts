import rateLimit from "express-rate-limit";

export const createReplyRateLimit = rateLimit({
  windowMs: 60 * 1000 * 10,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
});

export const getAllReplyRateLimit = rateLimit({
  windowMs: 60 * 1000 * 10,
  limit: 50,
  standardHeaders: true,
  legacyHeaders: false,
});

export const updateReplyRateLimit = rateLimit({
  windowMs: 60 * 1000 * 15,
  limit: 15,
  standardHeaders: true,
  legacyHeaders: false,
});

export const deleteReplyRateLimit = rateLimit({
  windowMs: 60 * 1000 * 15,
  limit: 25,
  standardHeaders: true,
  legacyHeaders: false,
});

export const likeReplyRateLimit = rateLimit({
  windowMs: 60 * 1000 * 15,
  limit: 200,
  standardHeaders: true,
  legacyHeaders: false,
});
