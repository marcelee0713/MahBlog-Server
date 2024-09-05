import { z } from "zod";

export const createCommentReplySchema = z.object({
  body: z.object({
    blogId: z.string().trim(),
    commentId: z.string().trim(),
    mentionedReplyId: z.string().trim().optional(),
    reply: z.string().trim(),
  }),
});

export const getCommentRepliesSchema = z.object({
  body: z.object({
    pagination: z.object({
      skip: z.number(),
      take: z.number(),
    }),
    authorId: z.string().trim(),
    blogId: z.string().trim(),
    commentId: z.string().trim(),
  }),
});

export const updateCommentReplySchema = z.object({
  body: z.object({
    replyId: z.string().trim(),
    newReply: z.string().trim(),
  }),
});

export const deleteCommentReplySchema = z.object({
  body: z.object({
    replyId: z.string().trim(),
  }),
});

export const likeReplySchema = z.object({
  body: z.object({
    replyId: z.string().trim(),
    commentId: z.string().trim(),
  }),
});
