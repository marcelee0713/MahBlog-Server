import { z } from "zod";
import { UserGetByEmailUseCase, UserUpdateUseCaseArr } from "../../types/user/user.types";

export const updateUserSchema = z.object({
  body: z.object({
    userId: z.string().trim().optional(),
    email: z.string().email().trim().optional(),
    newEmail: z.string().email().trim().optional(),
    currentPassword: z.string().min(8).optional(),
    password: z.string().min(8).optional(),
    useCase: z.enum(UserUpdateUseCaseArr),
    token: z.string().optional(),
  }),
});

export const getUserByEmailSchema = z.object({
  body: z.object({
    email: z.string().email().trim(),
    useCase: z.literal("GET_USER_DATA" as UserGetByEmailUseCase),
  }),
});

export const emailVerificationReqSchema = z.object({
  body: z.object({
    email: z.string().email().trim(),
    useCase: z.literal("VERIFY_EMAIL" as UserGetByEmailUseCase),
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
