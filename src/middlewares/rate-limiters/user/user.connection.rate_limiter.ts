import rateLimit from "express-rate-limit";

export const createConnectionsRateLimit = rateLimit({
  windowMs: 60 * 1000 * 15,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

export const updateConnectionsRateLimit = rateLimit({
  windowMs: 60 * 1000 * 15,
  limit: 50,
  standardHeaders: true,
  legacyHeaders: false,
});

export const getConnectionsRateLimit = rateLimit({
  windowMs: 60 * 1000,
  limit: 45,
  standardHeaders: true,
  legacyHeaders: false,
});
