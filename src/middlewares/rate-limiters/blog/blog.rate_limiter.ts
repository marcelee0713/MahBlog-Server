import rateLimit from "express-rate-limit";

export const createBlogRateLimit = rateLimit({
  windowMs: 60 * 1000 * 15,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

export const getBlogRateLimit = rateLimit({
  windowMs: 60 * 1000 * 15,
  limit: 15,
  standardHeaders: true,
  legacyHeaders: false,
});

export const getAllBlogRateLimit = rateLimit({
  windowMs: 60 * 1000 * 20,
  limit: 50,
  standardHeaders: true,
  legacyHeaders: false,
});

export const updateBlogRateLimit = rateLimit({
  windowMs: 60 * 1000 * 10,
  limit: 50,
  standardHeaders: true,
  legacyHeaders: false,
});

export const deleteBlogRateLimit = rateLimit({
  windowMs: 60 * 1000 * 15,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

export const likeBlogRateLimit = rateLimit({
  windowMs: 60 * 1000 * 15,
  limit: 200,
  standardHeaders: true,
  legacyHeaders: false,
});
