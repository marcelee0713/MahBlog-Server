import { LikesParams, CreateReplyLikesParams } from "../../interfaces/blog/blog.likes.interface";

export type CreateLikesParamsType<T extends LikeType> = ParamMapping[T];

type ParamMapping = {
  BLOG: LikesParams;
  COMMENT: LikesParams;
  REPLY: CreateReplyLikesParams;
};

export type LikeStatus = "LIKED" | "UNLIKED";

export type LikeType = "BLOG" | "COMMENT" | "REPLY";
