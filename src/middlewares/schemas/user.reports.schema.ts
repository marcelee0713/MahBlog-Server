import { z } from "zod";
import { ReportCategoriesArr, ReportTypeArr, ReportType } from "../../types/user/user.reports.type";
import { SortOrderArr } from "../../types";

export const getAllReportsSchema = z.object({
  body: z
    .object({
      userId: z.string().trim().optional(),
      reportId: z.string().trim().optional(),
      desc: z.string().trim().optional(),
      type: z.enum(ReportTypeArr).optional(),
      category: z.enum(ReportCategoriesArr).optional(),
      skip: z.number().optional(),
      take: z.number().optional(),
      dateOrder: z.enum(SortOrderArr).optional(),
    })
    .optional(),
});

export const getReportSchema = z.object({
  body: z.object({
    userId: z.string().trim(),
    reportId: z.string().trim(),
  }),
});

export const createReportIssueSchema = z.object({
  body: z.object({
    userId: z.string().trim().optional(),
    description: z.string(),
    email: z.string().email(),
    type: z.literal("ISSUE" as ReportType),
    category: z.enum(ReportCategoriesArr),
  }),
});

export const createReportUserSchema = z.object({
  body: z.object({
    userId: z.string().trim(),
    description: z.string(),
    email: z.string().email().optional(),
    type: z.literal("USER_REPORT" as ReportType),
    category: z.enum(ReportCategoriesArr),
    reportedUserId: z.string(),
  }),
});

export const createReportBlogSchema = z.object({
  body: z.object({
    userId: z.string().trim(),
    description: z.string(),
    email: z.string().email().optional(),
    type: z.literal("BLOG_REPORT" as ReportType),
    category: z.enum(ReportCategoriesArr),
    reportedUserId: z.string(),
    reportedBlogId: z.string(),
  }),
});

export const createReportCommentSchema = z.object({
  body: z.object({
    userId: z.string().trim(),
    description: z.string(),
    email: z.string().email().optional(),
    type: z.literal("COMMENT_REPORT" as ReportType),
    category: z.enum(ReportCategoriesArr),
    reportedUserId: z.string(),
    reportedBlogId: z.string(),
    reportedCommentId: z.string(),
  }),
});

export const createReportReplySchema = z.object({
  body: z.object({
    userId: z.string().trim(),
    description: z.string(),
    email: z.string().email().optional(),
    type: z.literal("REPLY_REPORT" as ReportType),
    category: z.enum(ReportCategoriesArr),
    reportedUserId: z.string(),
    reportedBlogId: z.string(),
    reportedCommentId: z.string(),
    reportedReplyId: z.string(),
  }),
});

export const deleteReportsSchema = z.object({
  body: z.object({
    userId: z.string().trim(),
  }),
});

export const deleteReportSchema = z.object({
  body: z.object({
    userId: z.string().trim(),
    reportId: z.string().trim(),
  }),
});
