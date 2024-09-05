import { RequestBody } from "..";
import {
  CreateBlogCommentRepliesParams,
  GetBlogCommentRepliesParams,
  UpdateBlogCommentRepliesParams,
} from "../../interfaces/blog/blog.comments.replies.interface";

export type CreateBlogCommentRepliesBodyReq = RequestBody<CreateBlogCommentRepliesParams>;

export type GetBlogCommentRepliesBodyReq = RequestBody<GetBlogCommentRepliesParams>;

export type UpdateBlogCommentRepliesBodyReq = RequestBody<UpdateBlogCommentRepliesParams>;
