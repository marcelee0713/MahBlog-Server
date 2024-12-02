import rateLimit from "express-rate-limit";

export const createCommentRateLimit = rateLimit({
  windowMs: 60 * 1000 * 10,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
});

export const getAllCommentRateLimit = rateLimit({
  windowMs: 60 * 1000 * 10,
  limit: 50,
  standardHeaders: true,
  legacyHeaders: false,
});

export const updateCommentRateLimit = rateLimit({
  windowMs: 60 * 1000 * 15,
  limit: 15,
  standardHeaders: true,
  legacyHeaders: false,
});

export const deleteCommentRateLimit = rateLimit({
  windowMs: 60 * 1000 * 15,
  limit: 25,
  standardHeaders: true,
  legacyHeaders: false,
});

export const likeCommentRateLimit = rateLimit({
  windowMs: 60 * 1000 * 15,
  limit: 200,
  standardHeaders: true,
  legacyHeaders: false,
});
