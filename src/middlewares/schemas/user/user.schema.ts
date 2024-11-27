import { z } from "zod";
import { GetUserByEmailUseCase, UpdateUserUseCaseArr } from "../../../types/user/user.types";

export const updateUserSchema = z.object({
  body: z.object({
    userId: z.string().trim().optional(),
    email: z.string().email().trim().optional(),
    newEmail: z.string().email().trim().optional(),
    currentPassword: z.string().optional(),
    password: z.string().min(8).optional(),
    removeSessions: z.boolean().optional(),
    useCase: z.enum(UpdateUserUseCaseArr),
    token: z.string().optional(),
  }),
});

export const getUserByEmailSchema = z.object({
  body: z.object({
    email: z.string().email().trim(),
    useCase: z.literal("GET_USER_DATA" as GetUserByEmailUseCase),
  }),
});

export const emailVerificationReqSchema = z.object({
  body: z.object({
    email: z.string().email().trim(),
    useCase: z.literal("VERIFY_EMAIL" as GetUserByEmailUseCase),
  }),
});

export const resetPasswordReqSchema = z.object({
  body: z.object({
    email: z.string().email().trim(),
  }),
});

export const tokenSchema = z.object({
  body: z.object({
    token: z.string(),
  }),
});
