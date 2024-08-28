import { injectable } from "inversify";
import { IBlogLikesRepository } from "../../interfaces/blog/blog.likes.interface";
import { PrismaClient } from "@prisma/client";
import { db } from "../../config/db";
import { CustomError } from "../../utils/error_handler";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { LikeType } from "../../types/blog/blog.types";

@injectable()
export class BlogLikesRepository implements IBlogLikesRepository {
  private db: PrismaClient;

  constructor() {
    this.db = db;
  }

  async get(userId: string, blogId: string): Promise<string | null> {
    try {
      const data = await this.db.blogLikes.findFirst({
        where: {
          userId: userId,
          blogId: blogId,
        },
      });

      if (!data) return null;

      return data.blogLikeId;
    } catch (err) {
      throw new CustomError(
        "internal-server-error",
        "An internal server error occured when getting a blog like's info.",
        500,
        "BlogLikesRepository",
        "By getting a blog like's info."
      );
    }
  }

  async create(userId: string, blogId: string): Promise<LikeType> {
    try {
      await this.db.blogLikes.create({
        data: {
          blog: {
            connect: {
              blogId,
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
          throw new CustomError("does-not-exist", "This blog may no longer exist.");
      }

      throw new CustomError(
        "internal-server-error",
        "An internal server error occured when liking a blog.",
        500,
        "BlogLikesRepository",
        "By liking a blog."
      );
    }
  }

  async delete(userId: string, blogLikeId: string): Promise<LikeType> {
    try {
      await this.db.blogLikes.delete({
        where: {
          userId,
          blogLikeId,
        },
      });

      return "UNLIKED";
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === "P2025")
          throw new CustomError("does-not-exist", "This data does not exist.");
      }

      throw new CustomError(
        "internal-server-error",
        "An internal server error occured when unliking a blog.",
        500,
        "BlogLikesRepository",
        "By unliking a blog."
      );
    }
  }
}
