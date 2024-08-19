import { z } from "zod";
import {
  BlogSortingOptionsArr,
  BlogVisibilityArr,
  UpdateBlogImageUseCaseArr,
} from "../../../types/blog/blog.types";

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

export const getBlogsSchema = z.object({
  body: z.object({
    pagination: z.object({
      skip: z.number(),
      take: z.number(),
    }),
    filters: z.object({
      authorId: z.string().trim().optional(),
      searchQuery: z.string().trim().optional(),
      tags: z.array(z.string()).optional(),
      sortBy: z.enum(BlogSortingOptionsArr),
      visibility: z.enum(BlogVisibilityArr),
    }),
  }),
});

export const getBlogSchema = z.object({
  body: z.object({
    authorId: z.string().trim(),
    blogId: z.string().trim(),
  }),
});
