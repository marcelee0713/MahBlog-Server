import { LikeType } from "../../types/blog/blog.types";

export interface IBlogLikesRepository {
  get: (userId: string, blogId: string) => Promise<string | null>;
  create: (userId: string, blogId: string) => Promise<LikeType>;
  delete: (blogLikeId: string) => Promise<LikeType>;
}
