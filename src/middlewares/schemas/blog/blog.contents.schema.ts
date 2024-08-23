import { z } from "zod";
import { UpdateBlogImageUseCaseArr } from "../../../types/blog/blog.types";

export const createAndGetBlogContentSchema = z.object({
  body: z.object({
    blogId: z.string().trim(),
  }),
});

export const updateBlogContentSchema = z.object({
  body: z.object({
    blogId: z.string().trim(),
    blogContentId: z.string().trim(),
    index: z.string().regex(/^\d+$/, "Index must be a string containing only numbers").optional(),
    title: z.string().trim().optional(),
    description: z.string().trim().optional(),
    updateImageMode: z.enum(UpdateBlogImageUseCaseArr).default("NONE"),
  }),
});

export const deleteBlogContentSchema = z.object({
  body: z.object({
    blogId: z.string().trim(),
    blogContentId: z.string().trim(),
  }),
});
