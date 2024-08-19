import { PrismaClient } from "@prisma/client";
import {
  BlogInfo,
  CreateBlogResponse,
  GetBlogsParams,
  IBlogRepository,
  UpdateBlogParams,
} from "../../interfaces/blog/blog.interface";
import { db } from "../../config/db";
import { CustomError } from "../../utils/error_handler";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { BlogSortingOptions } from "../../types/blog/blog.types";
import { injectable } from "inversify";

@injectable()
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

  async get(userId: string, authorId: string, blogId: string): Promise<BlogInfo> {
    try {
      const data = await this.db.blogs.findFirst({
        where: {
          authorId,
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
        authorId: data.authorId,
        blogId: data.blogId,
        coverImage: data.coverImage,
        description: data.description,
        title: data.title,
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
        editable: userId === authorId,
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

  async getAll(params: GetBlogsParams): Promise<BlogInfo[]> {
    const orderByOptions: Record<BlogSortingOptions, object> = {
      BEST: [{ scores: { bestScore: "desc" } }, { createdAt: "desc" }],
      CONTROVERSIAL: [{ scores: { controversialScore: "desc" } }, { createdAt: "desc" }],
      LATEST: { createdAt: "desc" },
      OLDEST: { createdAt: "asc" },
    };

    try {
      const data = await this.db.blogs.findMany({
        skip: params.pagination.skip,
        take: params.pagination.take,
        where: {
          authorId: params.filters.authorId,
          title: {
            contains: params.filters.searchQuery,
            mode: "insensitive",
          },
          tags: params.filters.tags
            ? {
                some: {
                  tag: {
                    in: params.filters.tags,
                  },
                },
              }
            : undefined,
          visiblity: params.filters.visibility,
        },
        orderBy: orderByOptions[params.filters.sortBy],
        include: {
          likes: true,
          comments: true,
          commentReplies: true,
          tags: true,
        },
      });

      const blogs: BlogInfo[] = [];

      for (let i = 0; i < data.length; i++) {
        const blog = data[i];
        const tags: string[] = blog.tags.map((val) => val.tag);
        const comments = blog.commentReplies.length + blog.comments.length;

        blogs.push({
          authorId: blog.authorId,
          blogId: blog.blogId,
          coverImage: blog.coverImage,
          description: blog.description,
          title: blog.title,
          tags: tags,
          engagement: {
            comments,
            likes: blog.likes.length,
          },
          publicationDetails: {
            status: blog.status,
            visibility: blog.visiblity,
          },
          timestamps: {
            createdAt: blog.createdAt,
            updatedAt: blog.updatedAt,
          },
          editable: params.userId === params.filters.authorId,
        });
      }

      return blogs;
    } catch (err) {
      throw new CustomError(
        "internal-server-error",
        `An error occured when getting all blog info.`,
        500,
        "BlogRepository"
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

      const tagsToIgnore: string[] = [];

      const tagIdsToRemove: string[] = [];

      if (params.tags) {
        for (let i = 0; i < tagsData.length; i++) {
          if (!params.tags.includes(tagsData[i].tag)) {
            tagIdsToRemove.push(tagsData[i].tagId);
            continue;
          }

          tagsToIgnore.push(tagsData[i].tag);
        }

        await this.db.blogTags.deleteMany({
          where: {
            blogId: params.blogId,
            tagId: {
              in: tagIdsToRemove,
            },
          },
        });

        const tagsToBeAdded: { blogId: string; tag: string }[] = [];

        for (let i = 0; i < params.tags.length; i++) {
          const element = params.tags[i];

          if (tagsToIgnore.includes(element)) continue;

          tagsToBeAdded.push({
            blogId: params.blogId,
            tag: element,
          });
        }

        await this.db.blogTags.createMany({
          data: tagsToBeAdded,
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
          coverImage: params.coverImage,
          updatedAt: new Date(),
        },
        include: {
          comments: true,
          commentReplies: true,
          likes: true,
          tags: true,
        },
      });

      const tags: string[] = data.tags.map((val) => val.tag);

      const comments = data.commentReplies.length + data.comments.length;

      return {
        authorId: data.authorId,
        blogId: data.blogId,
        coverImage: data.coverImage,
        description: data.description,
        title: data.title,
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
        editable: true,
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

  async delete(userId: string, blogId: string): Promise<string[]> {
    try {
      const images: string[] = [];
      const blog = await this.db.blogs.delete({
        where: {
          blogId: blogId,
          authorId: userId,
        },
        include: {
          contents: true,
        },
      });

      if (blog.coverImage) images.push(blog.coverImage);

      for (let i = 0; i < blog.contents.length; i++) {
        const image = blog.contents[i].contentImage;

        if (image) images.push(image);
      }

      return images;
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
