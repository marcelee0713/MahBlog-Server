import { injectable } from "inversify";
import {
  BlogCommentsData,
  CreateBlogCommentParams,
  GetBlogCommentsParams,
  IBlogCommentsRepository,
  RawBlogCommentData,
  UpdateBlogCommentsParams,
} from "../../ts/interfaces/blog/blog.comments.interface";
import { PrismaClient } from "@prisma/client";
import { db } from "../../config/db";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { CustomError } from "../../utils/error_handler";
import { BlogSortingOptions } from "../../ts/types/blog/blog.types";

@injectable()
export class BlogCommentsRepository implements IBlogCommentsRepository {
  private db: PrismaClient;

  constructor() {
    this.db = db;
  }

  async create(params: CreateBlogCommentParams): Promise<BlogCommentsData> {
    try {
      const data: RawBlogCommentData = await this.db.blogComments.create({
        data: {
          comment: params.comment,
          blog: {
            connect: {
              blogId: params.blogId,
            },
          },
          users: {
            connect: {
              userId: params.userId,
            },
          },
          scores: {
            create: {
              bestScore: 0,
              controversialScore: 0,
            },
          },
        },
        include: {
          likes: true,
          replies: true,
          blog: {
            select: {
              blogId: true,
              authorId: true,
            },
          },
        },
      });

      return await this.get(params.userId, data);
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === "P2025")
          throw new CustomError("does-not-exist", "This blog no longer exist.");
      }

      throw new CustomError(
        "internal-server-error",
        "An internal server error occured when creating a comment to a blog.",
        500,
        "BlogCommentsRepository",
        "By creating a comment."
      );
    }
  }

  async getAll(params: GetBlogCommentsParams): Promise<BlogCommentsData[]> {
    const orderByOptions: Record<BlogSortingOptions, object> = {
      BEST: { scores: { bestScore: "desc" } },
      CONTROVERSIAL: { scores: { controversialScore: "desc" } },
      LATEST: { createdAt: "desc" },
      OLDEST: { createdAt: "asc" },
    };

    try {
      const comments: RawBlogCommentData[] = await this.db.blogComments.findMany({
        skip: params.pagination.skip,
        take: params.pagination.take,
        where: {
          blog: {
            blogId: params.blogId,
            authorId: params.authorId,
          },
        },
        orderBy: orderByOptions[params.sortBy],
        include: {
          likes: true,
          replies: true,
          blog: {
            select: {
              blogId: true,
              authorId: true,
            },
          },
        },
      });

      const data: BlogCommentsData[] = [];

      for (let i = 0; i < comments.length; i++) {
        const comment = comments[i];

        const obj: BlogCommentsData = await this.get(params.userId, comment);

        data.push(obj);
      }

      return data;
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === "P2025")
          throw new CustomError("does-not-exist", "This blog no longer exist.");
      }

      throw new CustomError(
        "internal-server-error",
        "An internal server error occured when getting blog comments.",
        500,
        "BlogCommentsRepository",
        "By getting a blog comments."
      );
    }
  }

  async get(userId: string, data: RawBlogCommentData): Promise<BlogCommentsData> {
    const userData = await this.db.userProfile.findUnique({
      where: {
        userId: data.userId,
      },
    });

    if (!userData) throw new CustomError("does-not-exist", "User no longer exist.");

    const likes: string[] = data.likes.map((val) => val.userId);

    const fullName = `${userData.firstName} ${userData.middleName ?? ""} ${userData.lastName}`
      .replace(/\s+/g, " ")
      .trim();

    return {
      commentId: data.commentId,
      blog: {
        id: data.blog.blogId,
        authorId: data.blog.authorId,
      },
      comment: data.comment,
      details: {
        userId: data.userId,
        profilePicture: userData.profilePicture,
        fullName: fullName,
      },
      engagement: {
        likes: likes,
        replies: data.replies.length,
      },
      timestamps: {
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
      editable: userId === data.userId,
    };
  }

  async getRaw(params: CreateBlogCommentParams): Promise<RawBlogCommentData> {
    try {
      const data: RawBlogCommentData = await this.db.blogComments.create({
        data: {
          comment: params.comment,
          blog: {
            connect: {
              blogId: params.blogId,
            },
          },
          users: {
            connect: {
              userId: params.userId,
            },
          },
        },
        include: {
          likes: true,
          replies: true,
          blog: {
            select: {
              blogId: true,
              authorId: true,
            },
          },
        },
      });

      return data;
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === "P2025")
          throw new CustomError("does-not-exist", "This blog no longer exist.");
      }

      throw new CustomError(
        "internal-server-error",
        "An internal server error occured when creating a comment to a blog.",
        500,
        "BlogCommentsRepository",
        "By creating a comment."
      );
    }
  }

  async update(params: UpdateBlogCommentsParams): Promise<BlogCommentsData> {
    try {
      const data: RawBlogCommentData = await this.db.blogComments.update({
        where: {
          commentId: params.commentId,
          userId: params.userId,
        },
        data: {
          comment: params.newComment,
          updatedAt: new Date(),
        },
        include: {
          likes: true,
          replies: true,
          blog: {
            select: {
              blogId: true,
              authorId: true,
            },
          },
        },
      });

      return await this.get(params.userId, data);
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === "P2025")
          throw new CustomError("does-not-exist", "This blog comment may no longer exist.");
      }

      throw new CustomError(
        "internal-server-error",
        "An internal server error occured when updating a blog comment.",
        500,
        "BlogCommentsRepository",
        "By update a blog comment."
      );
    }
  }

  async delete(userId: string, commentId: string): Promise<void> {
    try {
      await this.db.blogComments.delete({
        where: {
          commentId,
          userId,
        },
      });
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === "P2025")
          throw new CustomError("does-not-exist", "This comment no longer exist.");
      }

      throw new CustomError(
        "internal-server-error",
        "An internal server error occured when deleting a blog comment.",
        500,
        "BlogCommentsRepository",
        "By deleting a blog comment."
      );
    }
  }
}
