import { injectable } from "inversify";
import {
  CreateUserNotificationParams,
  GetUserNotificationsParams,
  IUserNotificationsRepository,
  UserNotificationsData,
} from "../../interfaces/user/user.notifications.interface";
import { Prisma, PrismaClient } from "@prisma/client";
import { db } from "../../config/db";
import { CustomError } from "../../utils/error_handler";

@injectable()
export class UserNotificationsRepository implements IUserNotificationsRepository {
  private db: PrismaClient;

  constructor() {
    this.db = db;
  }

  async create(params: CreateUserNotificationParams): Promise<void> {
    try {
      const { referenceIds } = params.details;

      await this.db.userNotifications.create({
        data: {
          type: params.type,
          message: params.message,
          receiver: {
            connect: {
              userId: params.details.user.receiverId,
            },
          },
          sender: params.details.user.senderId
            ? {
                connect: {
                  userId: params.details.user.senderId,
                },
              }
            : undefined,
          Blogs: referenceIds?.blog
            ? {
                connect: {
                  blogId: referenceIds.blog,
                },
              }
            : undefined,
          BlogComments: referenceIds?.comment
            ? {
                connect: {
                  commentId: referenceIds.comment,
                },
              }
            : undefined,
          BlogCommentReplies: referenceIds?.reply
            ? {
                connect: {
                  replyId: referenceIds.reply,
                },
              }
            : undefined,
        },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2025") {
          throw new CustomError(
            "does-not-exist",
            "Some of the reference ids (receiverId, blogId, etc...) are not found.",
            404,
            "UserNotificationsRepository",
            err.meta ? (err.meta.cause as string) : undefined
          );
        }
      }

      throw new CustomError(
        "internal-server-error",
        "An internal server error occured when creating a notification.",
        500,
        "UserNotificationRepository",
        `By creating a notification.`
      );
    }
  }

  async getAll(params: GetUserNotificationsParams): Promise<UserNotificationsData[]> {
    try {
      const { pagination } = params;

      const raw = await this.db.userNotifications.findMany({
        skip: pagination.skip,
        take: pagination.take,
        where: {
          receiverId: params.userId,
        },
        orderBy: {
          createdAt: params.sortBy,
        },
        include: {
          sender: {
            include: {
              profile: true,
            },
          },
        },
      });

      const data: UserNotificationsData[] = raw.map((val) => {
        const { sender, blogId, commentId, replyId } = val;

        const firstName = sender?.profile?.firstName || "Unknown";
        const middleName = sender?.profile?.middleName || "";
        const lastName = sender?.profile?.lastName || "User";
        const senderFullName = [firstName, middleName, lastName].filter(Boolean).join(" ");

        const obj: UserNotificationsData = {
          ...val,
          details: {
            user: {
              receiverId: params.userId,
              sender: sender
                ? {
                    id: sender.userId,
                    name: senderFullName,
                    pfp: sender.profile?.profilePicture ?? null,
                  }
                : null,
            },
            referenceIds: blogId
              ? {
                  blog: blogId,
                  comment: commentId,
                  reply: replyId,
                }
              : null,
          },
        };

        return obj;
      });

      return data;
    } catch (err) {
      throw new CustomError(
        "internal-server-error",
        "An internal server error occured when getting user's notifications.",
        500,
        "UserNotificationRepository",
        `By getting user's notifications.`
      );
    }
  }

  async getCount(userId: string): Promise<number> {
    try {
      const count = await this.db.userNotifications.count({
        where: {
          receiverId: userId,
          status: "NOT_SEEN",
        },
      });

      return count;
    } catch (err) {
      throw new CustomError(
        "internal-server-error",
        "An internal server error occured when getting user's notifications count.",
        500,
        "UserNotificationRepository",
        `By getting user's notifications count.`
      );
    }
  }

  async update(userId: string): Promise<void> {
    try {
      await this.db.userNotifications.updateMany({
        where: {
          receiverId: userId,
          status: "NOT_SEEN",
        },
        data: {
          status: "SEEN",
        },
      });
    } catch (err) {
      throw new CustomError(
        "internal-server-error",
        "An internal server error occured when updating user's notifications.",
        500,
        "UserNotificationRepository",
        `By updating user's notifications.`
      );
    }
  }

  async delete(userId: string, notificationId: string): Promise<void> {
    try {
      await this.db.userNotifications.delete({
        where: {
          receiverId: userId,
          notificationId,
        },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2025") {
          throw new CustomError("does-not-exist", "User notification does not exist.", 404);
        }
      }

      throw new CustomError(
        "internal-server-error",
        "An internal server error occured when delete user's notification.",
        500,
        "UserNotificationRepository",
        `By deleting user's notification.`
      );
    }
  }
}
