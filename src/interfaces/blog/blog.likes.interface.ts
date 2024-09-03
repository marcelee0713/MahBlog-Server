import { LikeStatus, LikeType } from "../../types/blog/blog.types";

// Note: Maybe a LikesRepository is much more better to be here instead.
// rather than creating three repositories of this with literally the same functionality.

export interface IBlogLikesRepository {
  get: (userId: string, blogId: string) => Promise<string | null>;
  create: (userId: string, blogId: string) => Promise<LikeStatus>;
  delete: (userId: string, blogLikeId: string) => Promise<LikeStatus>;
}

export interface IBlogCommentLikesRepository {
  get: (userId: string, commentId: string) => Promise<string | null>;
  create: (userId: string, commentId: string) => Promise<LikeStatus>;
  delete: (userId: string, commentLikeId: string) => Promise<LikeStatus>;
}

export interface LikesRepository {
  get: (userId: string, id: string, type: LikeType) => Promise<string | null>;
  create: (userId: string, id: string, type: LikeType) => Promise<LikeStatus>;
  delete: (userId: string, likeId: string, type: LikeType) => Promise<LikeStatus>;
}
