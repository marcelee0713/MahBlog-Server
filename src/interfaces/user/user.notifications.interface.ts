import { SortOrder } from "../../types";
import { NotificationStatus, NotificationType } from "../../types/user/user.notifications.type";

export interface IUserNotificationsService {
  createNotification: (params: CreateUserNotificationParams) => Promise<void>;
  getNotifications: (params: GetUserNotificationsParams) => Promise<UserNotificationsData[]>;
  getNotificationsCount: (userId: string) => Promise<number>;
  updateNotifications: (userId: string) => Promise<void>;
  deleteNotification: (userId: string, notificationId: string) => Promise<void>;
}

export interface IUserNotificationsRepository {
  create: (params: CreateUserNotificationParams) => Promise<void>;
  getAll: (params: GetUserNotificationsParams) => Promise<UserNotificationsData[]>;
  getCount: (userId: string) => Promise<number>;
  update: (userId: string) => Promise<void>;
  delete: (userId: string, notificationId: string) => Promise<void>;
}

export interface CreateUserNotificationParams {
  message?: string;
  type: NotificationType;
  details: {
    user: {
      receiverId: string;
      senderId?: string;
    };
    referenceIds?: {
      blog: string;
      comment?: string;
      reply?: string;
    };
  };
}

export interface GetUserNotificationsParams {
  userId: string;
  pagination: {
    skip: number;
    take: number;
  };
  sortBy: SortOrder;
}

export interface UserNotificationsData {
  notificationId: string;
  type: NotificationType;
  status: NotificationStatus;
  message: string | null;
  details: {
    user: {
      receiverId: string;
      sender: {
        id: string;
        pfp: string | null;
        name: string | null;
      } | null;
    };
    referenceIds: {
      blog: string;
      comment: string | null;
      reply: string | null;
    } | null;
  };
  createdAt: Date;
}
