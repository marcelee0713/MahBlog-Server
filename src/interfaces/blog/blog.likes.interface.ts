import { CreateLikesParamsType, LikeStatus, LikeType } from "../../types/blog/blog.likes.types";

export interface ILikesRepository {
  get: (userId: string, id: string, type: LikeType) => Promise<string | null>;
  create: <T extends LikeType>(params: CreateLikesParamsType<T>, type: T) => Promise<LikeStatus>;
  delete: (userId: string, id: string, type: LikeType) => Promise<LikeStatus>;
}

export interface LikesParams {
  userId: string;
  id: string;
  type: LikeType;
}

export interface CreateReplyLikesParams extends LikesParams {
  commentId: string;
}
