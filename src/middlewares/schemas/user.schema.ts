import { z } from "zod";
import { UserUpdateUseCaseArr } from "../../types/user/user.types";

export const updateUserSchema = z.object({
  body: z.object({
    userId: z.string().trim().optional(),
    email: z.string().email().trim().optional(),
    newEmail: z.string().email().trim().optional(),
    currentPassword: z.string().min(8).optional(),
    password: z.string().min(8).optional(),
    useCase: z.enum(UserUpdateUseCaseArr),
  }),
});
