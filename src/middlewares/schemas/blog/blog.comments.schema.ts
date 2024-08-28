import { z } from "zod";
import { BlogSortingOptionsArr } from "../../../types/blog/blog.types";

export const createBlogCommentSchema = z.object({
  body: z.object({
    blogId: z.string().trim(),
    comment: z.string().trim(),
  }),
});

export const getBlogCommentSchema = z.object({
  body: z.object({
    pagination: z.object({
      skip: z.number(),
      take: z.number(),
    }),
    blogId: z.string().trim(),
    authorId: z.string().trim(),
    sortBy: z.enum(BlogSortingOptionsArr),
  }),
});

export const updateBlogCommentSchema = z.object({
  body: z.object({
    commentId: z.string().trim(),
    newComment: z.string().trim(),
  }),
});

export const deleteOrLikeBlogCommentSchema = z.object({
  body: z.object({
    commentId: z.string().trim(),
  }),
});
