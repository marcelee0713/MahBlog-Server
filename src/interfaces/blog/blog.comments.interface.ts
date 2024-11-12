import { BlogSortingOptions } from "../../types/blog/blog.types";
import { RawBlogCommentReplyData } from "./blog.comments.replies.interface";
import { LikesInfo } from "./blog.likes.interface";

export interface IBlogCommentsService {
  createBlogComment: (params: CreateBlogCommentParams) => Promise<BlogCommentsData>;
  getBlogComments: (params: GetBlogCommentsParams) => Promise<BlogCommentsData[]>;
  updateBlogComment: (params: UpdateBlogCommentsParams) => Promise<BlogCommentsData>;
  deleteBlogComment: (userId: string, commentId: string) => Promise<void>;
  toggleLike: (userId: string, commentId: string) => Promise<LikesInfo>;
}

export interface IBlogCommentsRepository {
  create: (params: CreateBlogCommentParams) => Promise<BlogCommentsData>;
  get: (userId: string, data: RawBlogCommentData) => Promise<BlogCommentsData>;
  getRaw: (params: CreateBlogCommentParams) => Promise<RawBlogCommentData>;
  getAll: (params: GetBlogCommentsParams) => Promise<BlogCommentsData[]>;
  update: (params: UpdateBlogCommentsParams) => Promise<BlogCommentsData>;
  delete: (userId: string, commentId: string) => Promise<void>;
}

export interface RawBlogCommentData {
  comment: string;
  commentId: string;
  userId: string;
  likes: RawBlogCommentLikeData[];
  replies: RawBlogCommentReplyData[];
  blog: {
    blogId: string;
    authorId: string;
  };
  createdAt: Date;
  updatedAt: Date | null;
}

export interface RawBlogCommentLikeData {
  commentLikeId: string;
  userId: string;
  commentId: string;
  replyId: string | null;
  createdAt: Date;
}

export interface BlogCommentsData {
  commentId: string;
  blog: {
    id: string;
    authorId: string;
  };
  comment: string;
  details: {
    userId: string;
    fullName: string;
    profilePicture: string | null;
  };
  engagement: {
    likes: string[];
    replies: number;
  };
  timestamps: {
    createdAt: Date;
    updatedAt: Date | null;
  };
  editable: boolean;
}

export interface CreateBlogCommentParams {
  userId: string;
  blogId: string;
  comment: string;
}

export interface GetBlogCommentsParams {
  pagination: {
    skip: number;
    take: number;
  };
  sortBy: BlogSortingOptions;
  authorId: string;
  blogId: string;
  userId: string;
}

export interface UpdateBlogCommentsParams {
  userId: string;
  commentId: string;
  newComment: string;
}
