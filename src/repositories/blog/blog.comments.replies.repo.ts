import { injectable } from "inversify";
import {
  BlogCommentReplyData,
  CreateBlogCommentRepliesParams,
  GetBlogCommentRepliesParams,
  IBlogCommentRepliesRepository,
  MentionedDetails,
  RawBlogCommentRepliesData,
  UpdateBlogCommentRepliesParams,
} from "../../interfaces/blog/blog.comments.replies.interface";
import { PrismaClient } from "@prisma/client";
import { db } from "../../config/db";
import { CustomError } from "../../utils/error_handler";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

@injectable()
export class BlogCommentRepliesRepository implements IBlogCommentRepliesRepository {
  private db: PrismaClient;

  constructor() {
    this.db = db;
  }

  async create(params: CreateBlogCommentRepliesParams): Promise<BlogCommentReplyData> {
    try {
      const data: RawBlogCommentRepliesData = await this.db.blogCommentReplies.create({
        data: {
          reply: params.reply,
          blog: {
            connect: {
              blogId: params.blogId,
            },
          },
          comment: {
            connect: {
              commentId: params.commentId,
            },
          },
          users: {
            connect: {
              userId: params.userId,
            },
          },
          mentionedReply: {
            connect: {
              replyId: params.mentionedReplyId,
            },
          },
        },
        include: {
          likes: true,
          mentionedReply: true,
        },
      });

      return this.get(data, params.userId);
    } catch (err) {
      if (err instanceof CustomError) throw err;

      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === "P2025")
          throw new CustomError("does-not-exist", "This comment may no longer exist.");
      }

      throw new CustomError(
        "internal-server-error",
        "An internal server error occured when a replying to a comment.",
        500,
        "BlogCommentRepliesRepository",
        "By creating a reply."
      );
    }
  }

  async get(data: RawBlogCommentRepliesData, userId: string): Promise<BlogCommentReplyData> {
    let mentionedData: MentionedDetails = {
      mentionedMessage: null,
      mentionedName: null,
      mentionedReplyId: null,
    };

    if (data.mentionedReply) {
      const userData = await this.db.userProfile.findUnique({
        where: {
          userId: data.mentionedReply.userId,
        },
      });

      if (!userData) throw new CustomError("does-not-exist", "Mentioned user no longer exist.");

      const fullName = `${userData.firstName} ${userData.middleName ?? ""} ${userData.lastName}`
        .replace(/\s+/g, " ")
        .trim();

      mentionedData = {
        mentionedMessage: data.mentionedReply.reply,
        mentionedReplyId: data.mentionedReply.replyId,
        mentionedName: fullName,
      };
    }

    const userData = await this.db.userProfile.findUnique({
      where: {
        userId: data.userId,
      },
    });

    if (!userData) throw new CustomError("does-not-exist", "User no longer exist.");

    const fullName = `${userData.firstName} ${userData.middleName ?? ""} ${userData.lastName}`
      .replace(/\s+/g, " ")
      .trim();

    const reply: BlogCommentReplyData = {
      replyId: data.replyId,
      blogId: data.blogId,
      commentId: data.commentId,
      details: {
        fullName,
        profilePicture: userData.profilePicture,
        userId: userData.userId,
      },
      engagement: {
        likes: [],
        repliesTo: mentionedData,
      },
      timestamps: {
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
      editable: data.userId === userId,
    };

    return reply;
  }

  async getAll(params: GetBlogCommentRepliesParams): Promise<BlogCommentReplyData[]> {
    try {
      const data: BlogCommentReplyData[] = [];

      const replies: RawBlogCommentRepliesData[] = await this.db.blogCommentReplies.findMany({
        skip: params.pagination.skip,
        take: params.pagination.take,
        where: {
          blog: {
            authorId: params.authorId,
            blogId: params.blogId,
          },
          commentId: params.commentId,
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          likes: true,
          mentionedReply: true,
        },
      });

      for (let i = 0; i < replies.length; i++) {
        const element = replies[i];

        const reply = await this.get(element, params.userId);

        data.push(reply);
      }

      return data;
    } catch (err) {
      if (err instanceof CustomError) throw err;

      throw new CustomError(
        "internal-server-error",
        "An internal server error occured when getting replies.",
        500,
        "BlogCommentRepliesRepository",
        "By getting a replies."
      );
    }
  }

  async update(params: UpdateBlogCommentRepliesParams): Promise<BlogCommentReplyData> {
    try {
      const data = await this.db.blogCommentReplies.update({
        where: {
          replyId: params.replyId,
          userId: params.userId,
        },
        data: {
          reply: params.newReply,
          updatedAt: new Date(),
        },
        include: {
          likes: true,
          mentionedReply: true,
        },
      });

      return this.get(data, params.userId);
    } catch (err) {
      if (err instanceof CustomError) throw err;

      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === "P2025")
          throw new CustomError("does-not-exist", "This reply may no longer exist.");
      }

      throw new CustomError(
        "internal-server-error",
        "An internal server error occured when updating a reply.",
        500,
        "BlogCommentRepliesRepository",
        "By updating a reply."
      );
    }
  }

  async delete(userId: string, replyId: string): Promise<void> {
    try {
      await this.db.blogCommentReplies.delete({
        where: {
          userId,
          replyId,
        },
      });
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === "P2025")
          throw new CustomError("does-not-exist", "This reply may no longer exist.");
      }

      throw new CustomError(
        "internal-server-error",
        "An internal server error occured when deleting a reply.",
        500,
        "BlogCommentRepliesRepository",
        "By deleting a reply."
      );
    }
  }
}
