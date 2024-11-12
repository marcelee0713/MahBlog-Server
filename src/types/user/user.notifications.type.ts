import { RequestBody } from "..";
import {
  CreateUserNotificationParams,
  GetUserNotificationsParams,
} from "../../interfaces/user/user.notifications.interface";

export const NotificationTypeArr = [
  "LIKED_BLOG",
  "COMMENT_BLOG",
  "REPLIED_COMMENT",
  "ACCEPTED_CONNECTION_STATUS",
  "REJECTED_CONNECTION_STATUS",
  "OTHER",
] as const;

export const NotificationStatusArr = ["SEEN", "NOT_SEEN"] as const;

export type NotificationStatus = (typeof NotificationStatusArr)[number];

export type NotificationType = (typeof NotificationTypeArr)[number];

export type CreateNotificationReqBody = RequestBody<CreateUserNotificationParams>;

export type GetNotificationReqBody = RequestBody<GetUserNotificationsParams>;
