import { injectable } from "inversify";
import {
  BlogContent,
  CreateBlogContentResponse,
  DeleteBlogContentParams,
  IBlogContentsRepository,
  UpdateBlogContentParams,
} from "../../interfaces/blog/blog.contents.interface";
import { PrismaClient } from "@prisma/client";
import { db } from "../../config/db";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { CustomError } from "../../utils/error_handler";

@injectable()
export class BlogContentsRepository implements IBlogContentsRepository {
  private db: PrismaClient;

  constructor() {
    this.db = db;
  }

  async create(userId: string, blogId: string): Promise<CreateBlogContentResponse> {
    try {
      const count = await this.db.blogContents.count({
        where: {
          blogId,
        },
      });

      const data = await this.db.blogContents.create({
        data: {
          index: count,
          blog: {
            connect: {
              blogId,
            },
          },
        },
      });

      const res: CreateBlogContentResponse = {
        blogContentId: data.blogContentId,
        blogId: data.blogId,
        userId,
      };

      return res;
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === "P2025")
          throw new CustomError("does-not-exist", "This blog no longer exist.");
      }

      throw new CustomError(
        "internal-server-error",
        "An internal server error occured when creating a blog content.",
        500,
        "BlogContentRepository",
        "By creating a blog's content."
      );
    }
  }

  async get(blogId: string, blogContentId: string): Promise<BlogContent> {
    try {
      const content = await this.db.blogContents.findFirst({
        where: {
          blogContentId: blogContentId,
          blogId: blogId,
        },
      });

      if (!content) throw new CustomError("does-not-exist", "This blog's content no longer exist.");

      return content;
    } catch (err) {
      if (err instanceof CustomError) throw err;

      throw new CustomError(
        "internal-server-error",
        "An internal server error occured when getting all blog's content.",
        500,
        "BlogContentRepository",
        "By getting all blog's content."
      );
    }
  }

  async getAll(blogId: string): Promise<BlogContent[]> {
    try {
      const data = await this.db.blogContents.findMany({
        where: {
          blogId: blogId,
        },
        orderBy: {
          index: "asc",
        },
      });

      return data;
    } catch (err) {
      throw new CustomError(
        "internal-server-error",
        "An internal server error occured when getting all blog's content.",
        500,
        "BlogContentRepository",
        "By getting all blog's content."
      );
    }
  }

  async update(params: UpdateBlogContentParams): Promise<BlogContent> {
    try {
      const data = await this.db.blogContents.update({
        where: {
          blogContentId: params.blogContentId,
          blogId: params.blogId,
        },
        data: {
          contentImage: params.contentImage,
          index: params.index,
          description: params.description ?? null,
          title: params.title ?? null,
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
        "An internal server error occured when updating blog's content.",
        500,
        "BlogContentRepository",
        "By updating a blog's content."
      );
    }
  }

  async delete(params: DeleteBlogContentParams): Promise<string | null> {
    try {
      const content = await this.db.blogContents.delete({
        where: {
          blogContentId: params.blogContentId,
          blogId: params.blogId,
        },
      });

      return content.contentImage;
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === "P2025")
          throw new CustomError("does-not-exist", "This blog no longer exist.");
      }

      throw new CustomError(
        "internal-server-error",
        "An internal server error occured when updating blog's content.",
        500,
        "BlogContentRepository",
        "By updating a blog's content."
      );
    }
  }
}
