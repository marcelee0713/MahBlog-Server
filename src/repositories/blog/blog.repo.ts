import { PrismaClient } from "@prisma/client";
import {
  BlogInfo,
  CreateBlogResponse,
  IBlogRepository,
  UpdateBlogParams,
} from "../../interfaces/blog/blog.interface";
import { db } from "../../config/db";
import { CustomError } from "../../utils/error_handler";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { arraysEqual } from "../../utils";

export class BlogRepository implements IBlogRepository {
  private db: PrismaClient;

  constructor() {
    this.db = db;
  }

  async create(userId: string): Promise<CreateBlogResponse> {
    try {
      const data = await this.db.blogs.create({
        data: {
          users: {
            connect: {
              userId: userId,
            },
          },
          scores: {
            create: {
              bestScore: 0,
              controversialScore: 0,
            },
          },
        },
      });

      return {
        userId,
        blogId: data.blogId,
      };
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === "P2025") throw new CustomError("does-not-exist", "User does not exist!");
      }

      throw new CustomError(
        "internal-server-error",
        "An internal server error occured when creating a blog.",
        500,
        "BlogRepository",
        "By creating a blog."
      );
    }
  }

  async get(userId: string, blogId: string): Promise<BlogInfo> {
    try {
      const data = await this.db.blogs.findFirst({
        where: {
          authorId: userId,
          blogId,
        },
        include: {
          likes: true,
          comments: true,
          commentReplies: true,
          tags: true,
        },
      });

      if (!data) throw new CustomError("does-not-exist", "Blog does not exist!");

      const tags: string[] = data.tags.map((val) => val.tag);

      const comments = data.commentReplies.length + data.comments.length;

      return {
        ...data,
        tags: tags,
        engagement: {
          comments,
          likes: data.likes.length,
        },
        publicationDetails: {
          status: data.status,
          visibility: data.visiblity,
        },
        timestamps: {
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        },
        editable: false,
      };
    } catch (err) {
      if (err instanceof CustomError) throw err;

      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === "P2025") throw new CustomError("does-not-exist", "User does not exist!");
      }

      throw new CustomError(
        "internal-server-error",
        "An internal server error occured when getting a blog info.",
        500,
        "BlogRepository",
        "By getting a blog's info."
      );
    }
  }

  async update(params: UpdateBlogParams): Promise<BlogInfo> {
    try {
      const tagsData = await this.db.blogTags.findMany({
        where: {
          blogId: params.blogId,
        },
      });

      const tags: string[] = tagsData.map((val) => val.tag);

      const tagIdsToRemove: string[] = [];

      if (!arraysEqual(params.tags, tags)) {
        for (let i = 0; i < tagsData.length; i++) {
          const element = tagsData[i];

          if (!params.tags.includes(element.tag)) tagIdsToRemove.push(element.tagId);
        }

        await this.db.blogTags.deleteMany({
          where: {
            blogId: params.blogId,
            tagId: {
              in: tagIdsToRemove,
            },
          },
        });
      }

      const data = await this.db.blogs.update({
        where: {
          blogId: params.blogId,
          authorId: params.userId,
        },
        data: {
          title: params.title,
          description: params.desc,
          visiblity: params.visibility,
          coverImage: params.coverImage ?? undefined,
        },
        include: {
          comments: true,
          commentReplies: true,
          likes: true,
          tags: true,
        },
      });

      const comments = data.commentReplies.length + data.comments.length;

      return {
        ...data,
        tags: tags,
        engagement: {
          comments,
          likes: data.likes.length,
        },
        publicationDetails: {
          status: data.status,
          visibility: data.visiblity,
        },
        timestamps: {
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        },
        editable: false,
      };
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === "P2025")
          throw new CustomError("does-not-exist", "User or blog does not exist!");
      }

      throw new CustomError(
        "internal-server-error",
        "An internal server error occured when updating a blog info.",
        500,
        "BlogRepository",
        "By updating a blog's info."
      );
    }
  }

  async delete(userId: string, blogId: string): Promise<void> {
    try {
      await this.db.blogs.delete({
        where: {
          blogId: blogId,
          authorId: userId,
        },
      });
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === "P2025")
          throw new CustomError("does-not-exist", "User or blog does not exist!");
      }

      throw new CustomError(
        "internal-server-error",
        "An internal server error occured when deleting a blog.",
        500,
        "BlogRepository",
        "By deleting a blog."
      );
    }
  }
}
