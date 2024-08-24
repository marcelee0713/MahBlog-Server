import { PrismaClient } from "@prisma/client";
import { BlogScoresData, IBlogScoresRepository } from "../../interfaces/blog/blog.scores.interface";
import { ScoreType, UpdateBlogScoresParams } from "../../types/blog/blog.scores.types";
import { db } from "../../config/db";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { CustomError } from "../../utils/error_handler";
import { injectable } from "inversify";

@injectable()
export class BlogScoresRepository implements IBlogScoresRepository {
  private db: PrismaClient;

  constructor() {
    this.db = db;
  }

  async get(type: ScoreType, id: string): Promise<BlogScoresData> {
    try {
      switch (type) {
        case "BLOG": {
          const data = await this.db.blogs.findFirst({
            where: {
              blogId: id,
            },
            include: {
              scores: true,
              comments: true,
              commentReplies: true,
              likes: true,
            },
          });

          if (!data) throw new CustomError("does-not-exist", `This blog no longer exist.`);

          if (!data.scores)
            throw new CustomError("does-not-exist", `This blog's score no longer exist.`);

          return {
            scoresId: data.scores.scoresId,
            type: type,
            bestScore: data.scores?.bestScore ?? 0,
            controversialScore: data.scores?.controversialScore ?? 0,
            comments: data.comments.length + data.commentReplies.length,
            likes: data.likes.length,
            createdAt: data.createdAt,
          };
        }
        case "COMMENT": {
          const data = await this.db.blogComments.findFirst({
            where: {
              blogId: id,
            },
            include: {
              scores: true,
              likes: true,
              replies: true,
            },
          });

          if (!data) throw new CustomError("does-not-exist", `This comment no longer exist.`);

          if (!data.scores)
            throw new CustomError("does-not-exist", `This blog's score no longer exist.`);

          return {
            scoresId: data.scores.scoresId,
            type: type,
            bestScore: data.scores?.bestScore ?? 0,
            controversialScore: data.scores?.controversialScore ?? 0,
            comments: data.replies.length,
            likes: data.likes.length,
            createdAt: data.createdAt,
          };
        }
        default: {
          throw new CustomError("internal-server-error", "Score type does not exist.");
        }
      }
    } catch (err) {
      if (err instanceof CustomError) throw err;

      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === "P2025")
          throw new CustomError(
            "does-not-exist",
            `This score data does not exist with the type: ${type}`
          );
      }

      throw new CustomError(
        "internal-server-error",
        "An internal server error occured when getting score data.",
        500,
        "BlogScoresRepository",
        `By getting a score data with the type: ${type}.`
      );
    }
  }

  async update(params: UpdateBlogScoresParams): Promise<void> {
    try {
      await this.db.scores.update({
        where: {
          scoresId: params.scoresId,
        },
        data: {
          bestScore: params.bestScore,
          controversialScore: params.controversialScore,
        },
      });
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === "P2025")
          throw new CustomError(
            "does-not-exist",
            `This score data does not exist with the type: ${params.type}`
          );
      }

      throw new CustomError(
        "internal-server-error",
        "An internal server error occured when getting score data.",
        500,
        "BlogScoresRepository",
        `By getting a score data with the type: ${params.type}.`
      );
    }
  }
}
