import { z } from "zod";
import { SortOrderArr } from "../../../types";
import { NotificationTypeArr } from "../../../types/user/user.notifications.type";

export const createNotificationSchema = z.object({
  body: z.object({
    message: z.string().trim().optional(),
    type: z.enum(NotificationTypeArr),
    details: z.object({
      user: z.object({
        receiverId: z.string().trim(),
        senderId: z.string().trim().optional(),
      }),
      referenceIds: z
        .object({
          blog: z.string().trim(),
          comment: z.string().trim().optional(),
          reply: z.string().trim().optional(),
        })
        .optional(),
    }),
  }),
});

export const getNotificationsSchema = z.object({
  body: z.object({
    pagination: z.object({
      skip: z.number(),
      take: z.number(),
    }),
    sortBy: z.enum(SortOrderArr),
  }),
});

export const deleteNotificationSchema = z.object({
  body: z.object({
    notificationId: z.string().trim(),
  }),
});
