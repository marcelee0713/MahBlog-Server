import { LikeStatus } from "../../types/blog/blog.likes.types";
import { RawBlogCommentLikeData } from "./blog.comments.interface";

export interface IBlogCommentRepliesService {
  reply: (params: CreateBlogCommentRepliesParams) => Promise<BlogCommentReplyData>;
  getReplies: (params: GetBlogCommentRepliesParams) => Promise<BlogCommentReplyData[]>;
  editReply: (params: UpdateBlogCommentRepliesParams) => Promise<BlogCommentReplyData>;
  removeReply: (userId: string, replyId: string) => Promise<void>;
  toggleLike: (userId: string, replyId: string, commentId: string) => Promise<LikeStatus>;
}

export interface IBlogCommentRepliesRepository {
  create: (params: CreateBlogCommentRepliesParams) => Promise<BlogCommentReplyData>;
  getAll: (params: GetBlogCommentRepliesParams) => Promise<BlogCommentReplyData[]>;
  get: (data: RawBlogCommentRepliesData, userId: string) => Promise<BlogCommentReplyData>;
  update: (params: UpdateBlogCommentRepliesParams) => Promise<BlogCommentReplyData>;
  delete: (userId: string, replyId: string) => Promise<void>;
}

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

export interface RawBlogCommentRepliesData extends RawBlogCommentReplyData {
  likes: RawBlogCommentLikeData[];
  mentionedReply: RawBlogCommentReplyData | null;
}

export interface CreateBlogCommentRepliesParams {
  userId: string;
  blogId: string;
  commentId: string;
  mentionedReplyId?: string;
  reply: string;
}

export interface GetBlogCommentRepliesParams {
  pagination: {
    skip: number;
    take: number;
  };
  authorId: string;
  blogId: string;
  commentId: string;
  userId: string;
}

export interface UpdateBlogCommentRepliesParams {
  replyId: string;
  userId: string;
  newReply: string;
}

export interface BlogCommentReplyData {
  replyId: string;
  commentId: string;
  blogId: string;
  reply: string;
  details: {
    userId: string;
    fullName: string;
    profilePicture: string | null;
  };
  engagement: {
    likes: string[];
    repliesTo: MentionedDetails;
  };
  timestamps: {
    createdAt: Date;
    updatedAt: Date | null;
  };
  editable: boolean;
}

export interface MentionedDetails {
  mentionedReplyId: string | null;
  mentionedName: string | null;
  mentionedMessage: string | null;
}
