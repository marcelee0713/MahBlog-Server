import { RequestBody } from "..";
import { GetBlogsParams, UpdateBlogParams } from "../../interfaces/blog/blog.interface";

export const BlogStatusArr = ["ACTIVE", "FLAGGED"] as const;

export const BlogVisibilityArr = ["PRIVATE", "PUBLIC", "DRAFTED"] as const;

export const BlogSortingOptionsArr = ["BEST", "CONTROVERSIAL", "LATEST", "OLDEST"] as const;

export const UpdateBlogImageUseCaseArr = ["REMOVE", "CHANGE", "NONE"] as const;

export type UpdateBlogImageUseCase = (typeof UpdateBlogImageUseCaseArr)[number];

export type BlogSortingOptions = (typeof BlogSortingOptionsArr)[number];

export type BlogStatus = (typeof BlogStatusArr)[number];

export type BlogVisibility = (typeof BlogVisibilityArr)[number];

export type GetBlogsBodyReq = RequestBody<GetBlogsParams>;

export type UpdateBlogBodyReq = RequestBody<UpdateBlogParams>;

export type LikeStatus = "LIKED" | "UNLIKED";

export type LikeType = "BLOG" | "COMMENT" | "REPLY";
