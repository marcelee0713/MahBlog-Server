import { injectable } from "inversify";
import { ILikesRepository, LikesInfo } from "../../interfaces/blog/blog.likes.interface";
import { PrismaClient } from "@prisma/client";
import { db } from "../../config/db";
import { CustomError } from "../../utils/error_handler";
import { CreateLikesParamsType, LikeStatus, LikeType } from "../../types/blog/blog.likes.types";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

@injectable()
export class LikesRepository implements ILikesRepository {
  private db: PrismaClient;

  constructor() {
    this.db = db;
  }

  async get(userId: string, id: string, type: LikeType): Promise<string | null> {
    const getByType: Record<LikeType, () => Promise<string | null>> = {
      BLOG: async () => {
        const data = await this.db.blogLikes.findFirst({
          where: {
            userId: userId,
            blogId: id,
          },
        });

        if (!data) return null;

        return data.blogLikeId;
      },

      COMMENT: async () => {
        const data = await this.db.blogCommentLikes.findFirst({
          where: {
            userId,
            commentId: id,
          },
        });

        if (!data) return null;

        return data.commentLikeId;
      },

      REPLY: async () => {
        const data = await this.db.blogCommentLikes.findFirst({
          where: {
            userId,
            replyId: id,
          },
        });

        if (!data) return null;

        return data.commentLikeId;
      },
    };

    try {
      const callback = getByType[type];

      const data = await callback();

      return data;
    } catch (err) {
      throw new CustomError(
        "internal-server-error",
        `An internal server error occured when getting a like type of ${type}.`,
        500,
        "LikesRepository",
        `By getting an like info type of ${type}.`
      );
    }
  }

  async create<T extends LikeType>(params: CreateLikesParamsType<T>): Promise<LikesInfo> {
    const info: LikesInfo = {
      likedByUserId: params.userId,
      likeStatus: "LIKED",
    };

    const createByType: Record<LikeType, () => Promise<void>> = {
      BLOG: async () => {
        const data = await this.db.blogLikes.create({
          data: {
            blog: {
              connect: {
                blogId: params.id,
              },
            },
            users: {
              connect: {
                userId: params.userId,
              },
            },
          },
          include: {
            blog: true,
          },
        });

        info.likedUserId = data.blog?.authorId;
      },

      COMMENT: async () => {
        const data = await this.db.blogCommentLikes.create({
          data: {
            comment: {
              connect: {
                commentId: params.id,
              },
            },
            users: {
              connect: {
                userId: params.userId,
              },
            },
          },
          include: {
            comment: true,
          },
        });

        info.likedUserId = data.comment?.userId;
      },

      REPLY: async () => {
        const param = params as CreateLikesParamsType<"REPLY">;

        const data = await this.db.blogCommentLikes.create({
          data: {
            reply: {
              connect: {
                replyId: param.id,
              },
            },
            comment: {
              connect: {
                commentId: param.commentId,
              },
            },
            users: {
              connect: {
                userId: param.userId,
              },
            },
          },
          include: {
            reply: true,
          },
        });

        info.likedUserId = data.reply?.userId;
      },
    };

    try {
      const callback = createByType[params.type];

      await callback();

      return info;
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === "P2025")
          throw new CustomError("does-not-exist", "A blog or comment may no longer exist.");
      }

      throw new CustomError(
        "internal-server-error",
        `An internal server error occured when liking a ${params.type}.`,
        500,
        "LikesRepository",
        `By liking a ${params.type}.`
      );
    }
  }

  async delete(userId: string, id: string, type: LikeType): Promise<LikeStatus> {
    const deleteByType: Record<LikeType, () => Promise<void>> = {
      BLOG: async () => {
        await this.db.blogLikes.delete({
          where: {
            blogLikeId: id,
            userId,
          },
        });
      },

      COMMENT: async () => {
        await this.db.blogCommentLikes.delete({
          where: {
            commentLikeId: id,
            userId,
          },
        });
      },

      REPLY: async () => {
        await this.db.blogCommentLikes.delete({
          where: {
            commentLikeId: id,
            userId,
          },
        });
      },
    };

    try {
      const callback = deleteByType[type];

      await callback();

      return "UNLIKED";
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === "P2025")
          throw new CustomError("does-not-exist", "A blog or comment may no longer exist.");
      }

      throw new CustomError(
        "internal-server-error",
        `An internal server error occured when deleting a like type of ${type}.`,
        500,
        "LikesRepository",
        `By deleting a like type of ${type}.`
      );
    }
  }
}
