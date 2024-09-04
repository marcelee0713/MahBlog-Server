import { LikeStatus } from "../../types/blog/blog.likes.types";
import { BlogSortingOptions, BlogStatus, BlogVisibility } from "../../types/blog/blog.types";

export interface IBlog {
  validateBlogTitle: (title: string) => void;

  validateBlogDesc: (description: string) => void;

  validateTags: (tags?: string[]) => string[] | undefined;
}

export interface IBlogService {
  createBlog: (userId: string) => Promise<CreateBlogResponse>;

  getBlogs: (params: GetBlogsParams) => Promise<BlogInfo[]>;

  getBlogInfo: (userId: string, authorId: string, blogId: string) => Promise<BlogInfo>;

  editBlog: (params: UpdateBlogParams) => Promise<BlogInfo>;

  deleteBlog: (userId: string, blogId: string) => Promise<string[]>;

  toggleLike: (userId: string, blogId: string) => Promise<LikeStatus>;
}

export interface IBlogRepository {
  create: (userId: string) => Promise<CreateBlogResponse>;

  get: (userId: string, authorId: string, blogId: string) => Promise<BlogInfo>;

  getAll: (params: GetBlogsParams) => Promise<BlogInfo[]>;

  update: (params: UpdateBlogParams) => Promise<BlogInfo>;

  delete: (userId: string, blogId: string) => Promise<string[]>;
}

export interface CreateBlogResponse {
  blogId: string;
  userId: string;
}

export interface GetBlogsParams {
  pagination: {
    skip: number;
    take: number;
  };
  filters: {
    authorId?: string;
    searchQuery?: string;
    tags?: string[];
    sortBy: BlogSortingOptions;
    visibility: BlogVisibility;
  };
  userId: string;
}

export interface UpdateBlogParams extends CreateBlogResponse {
  title?: string;
  desc?: string;
  coverImage?: string | null;
  tags?: string[];
  visibility: BlogVisibility;
}

export interface BlogInfo {
  blogId: string;
  authorId: string;
  title: string | null;
  description: string | null;
  coverImage: string | null;
  tags: string[];
  timestamps: {
    createdAt: Date;
    updatedAt: Date | null;
  };
  publicationDetails: {
    visibility: BlogVisibility;
    status: BlogStatus;
  };
  engagement: {
    likes: string[];
    comments: number;
  };
  editable: boolean;
}
