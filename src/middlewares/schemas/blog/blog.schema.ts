import { z } from "zod";
import { BlogVisibilityArr, UpdateBlogImageUseCaseArr } from "../../../types/blog/blog.types";

export const updateBlogSchema = z.object({
  body: z.object({
    blogId: z.string().trim(),
    title: z.string().trim().optional(),
    desc: z.string().trim().optional(),
    tags: z.string().optional(),
    visibility: z.enum(BlogVisibilityArr),
    updateImageMode: z.enum(UpdateBlogImageUseCaseArr).default("NONE"),
  }),
});
