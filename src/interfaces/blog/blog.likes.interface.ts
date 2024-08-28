import { LikeType } from "../../types/blog/blog.types";

export interface IBlogLikesRepository {
  get: (userId: string, blogId: string) => Promise<string | null>;
  create: (userId: string, blogId: string) => Promise<LikeType>;
  delete: (userId: string, blogLikeId: string) => Promise<LikeType>;
}

export interface IBlogCommentLikesRepository {
  get: (userId: string, commentId: string) => Promise<string | null>;
  create: (userId: string, commentId: string) => Promise<LikeType>;
  delete: (userId: string, commentLikeId: string) => Promise<LikeType>;
}
