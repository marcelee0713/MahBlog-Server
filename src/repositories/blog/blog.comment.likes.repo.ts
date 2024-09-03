import { injectable } from "inversify";
import { IBlogCommentLikesRepository } from "../../interfaces/blog/blog.likes.interface";
import { LikeStatus } from "../../types/blog/blog.types";
import { PrismaClient } from "@prisma/client";
import { db } from "../../config/db";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { CustomError } from "../../utils/error_handler";

@injectable()
export class BlogCommentLikesRepository implements IBlogCommentLikesRepository {
  private db: PrismaClient;

  constructor() {
    this.db = db;
  }

  async get(userId: string, commentId: string): Promise<string | null> {
    try {
      const data = await this.db.blogCommentLikes.findFirst({
        where: {
          userId,
          commentId,
        },
      });

      if (!data) return null;

      return data.commentLikeId;
    } catch (err) {
      throw new CustomError(
        "internal-server-error",
        "An internal server error occured when getting a blog comment like's info.",
        500,
        "BlogCommentLikesRepository",
        "By getting a blog comment like's info."
      );
    }
  }

  async create(userId: string, commentId: string): Promise<LikeStatus> {
    try {
      await this.db.blogCommentLikes.create({
        data: {
          comment: {
            connect: {
              commentId,
            },
          },
          users: {
            connect: {
              userId,
            },
          },
        },
      });

      return "LIKED";
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === "P2025")
          throw new CustomError("does-not-exist", "This comment may no longer exist.");
      }

      throw new CustomError(
        "internal-server-error",
        "An internal server error occured when liking a blog comment.",
        500,
        "BlogCommentLikesRepository",
        "By liking a blog comment."
      );
    }
  }

  async delete(userId: string, commentLikeId: string): Promise<LikeStatus> {
    try {
      await this.db.blogCommentLikes.delete({
        where: {
          userId,
          commentLikeId,
        },
      });

      return "UNLIKED";
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === "P2025")
          throw new CustomError("does-not-exist", "This comment does not exist.");
      }

      throw new CustomError(
        "internal-server-error",
        "An internal server error occured when unliking a comment.",
        500,
        "BlogCommentLikesRepository",
        "By unliking a comment."
      );
    }
  }
}
