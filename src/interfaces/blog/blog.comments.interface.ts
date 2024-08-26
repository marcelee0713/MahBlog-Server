import { BlogSortingOptions } from "../../types/blog/blog.types";

export interface IBlogCommentsService {
  createBlogComment: (params: CreateBlogCommentParams) => Promise<BlogCommentsData>;
  getBlogComments: (params: GetBlogCommentsParams) => Promise<BlogCommentsData[]>;
  updateBlogComment: (params: UpdateBlogCommentsParams) => Promise<BlogCommentsData>;
  deleteBlogComment: (commentId: string, userId: string) => Promise<void>;
}

export interface IBlogCommentsRepository {
  create: (params: CreateBlogCommentParams) => Promise<BlogCommentsData>;
  get: (userId: string, data: RawBlogCommentData) => Promise<BlogCommentsData>;
  getRaw: (params: CreateBlogCommentParams) => Promise<RawBlogCommentData>;
  getAll: (params: GetBlogCommentsParams) => Promise<BlogCommentsData[]>;
  update: (params: UpdateBlogCommentsParams) => Promise<BlogCommentsData>;
  delete: (commentId: string, userId: string) => Promise<void>;
}

export interface RawBlogCommentData {
  blogId: string;
  comment: string;
  commentId: string;
  userId: string;
  likes: RawBlogCommentLikeData[];
  replies: RawBlogCommentReplyData[];
  createdAt: Date;
  updatedAt: Date | null;
}

// Note: Maybe put this somewhere else?
export interface RawBlogCommentLikeData {
  commentLikeId: string;
  userId: string;
  commentId: string;
  replyId: string | null;
  createdAt: Date;
}

// Note: Maybe put this somewhere else also?
export interface RawBlogCommentReplyData {
  replyId: string;
  commentId: string;
  blogId: string;
  userId: string;
  mentionedReplyId: string | null;
  reply: string;
  createdAt: Date;
  updatedAt: Date | null;
}

export interface BlogCommentsData {
  commentId: string;
  blogId: string;
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
