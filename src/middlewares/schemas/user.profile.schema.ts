import { z } from "zod";

export const updateProfileNameSchema = z.object({
  body: z.object({
    firstName: z.string().trim(),
    middleName: z.string().trim().optional(),
    lastName: z.string().trim(),
  }),
});

export const updateProfileBioSchema = z.object({
  body: z.object({
    bio: z.string().trim().optional(),
  }),
});

export const removeProfileImageSchema = z.object({
  body: z.object({
    image: z.string().trim(),
  }),
});
