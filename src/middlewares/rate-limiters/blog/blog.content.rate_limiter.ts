import rateLimit from "express-rate-limit";

export const createBlogContentRateLimit = rateLimit({
  windowMs: 60 * 1000 * 10,
  limit: 50,
  standardHeaders: true,
  legacyHeaders: false,
});

export const getAllBlogContentRateLimit = rateLimit({
  windowMs: 60 * 1000 * 10,
  limit: 50,
  standardHeaders: true,
  legacyHeaders: false,
});

export const updateBlogContentRateLimit = rateLimit({
  windowMs: 60 * 1000 * 10,
  limit: 75,
  standardHeaders: true,
  legacyHeaders: false,
});

export const deleteBlogContentRateLimit = rateLimit({
  windowMs: 60 * 1000 * 15,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
});
