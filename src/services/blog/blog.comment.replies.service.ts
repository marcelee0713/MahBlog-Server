import { inject, injectable } from "inversify";
import {
  BlogCommentReplyData,
  CreateBlogCommentRepliesParams,
  GetBlogCommentRepliesParams,
  IBlogCommentRepliesRepository,
  IBlogCommentRepliesService,
  UpdateBlogCommentRepliesParams,
} from "../../ts/interfaces/blog/blog.comments.replies.interface";
import { ILikesRepository, LikesInfo } from "../../ts/interfaces/blog/blog.likes.interface";
import { TYPES } from "../../constants";

@injectable()
export class BlogCommentRepliesService implements IBlogCommentRepliesService {
  private repo: IBlogCommentRepliesRepository;
  private likeRepo: ILikesRepository;

  constructor(
    @inject(TYPES.BlogCommentRepliesRepository) repo: IBlogCommentRepliesRepository,
    @inject(TYPES.LikesRepository) likeRepo: ILikesRepository
  ) {
    this.repo = repo;
    this.likeRepo = likeRepo;
  }

  async reply(params: CreateBlogCommentRepliesParams): Promise<BlogCommentReplyData> {
    return await this.repo.create(params);
  }

  async getReplies(params: GetBlogCommentRepliesParams): Promise<BlogCommentReplyData[]> {
    return await this.repo.getAll(params);
  }

  async editReply(params: UpdateBlogCommentRepliesParams): Promise<BlogCommentReplyData> {
    return await this.repo.update(params);
  }

  async removeReply(userId: string, replyId: string): Promise<void> {
    await this.repo.delete(userId, replyId);
  }

  async toggleLike(userId: string, replyId: string, commentId: string): Promise<LikesInfo> {
    let info: LikesInfo = {
      likedByUserId: userId,
      likeStatus: "UNLIKED",
    };

    const replyLikeId = await this.likeRepo.get(userId, replyId, "REPLY");

    if (replyLikeId) info.likeStatus = await this.likeRepo.delete(userId, replyLikeId, "REPLY");
    else
      info = await this.likeRepo.create({ userId, id: replyId, commentId, type: "REPLY" }, "REPLY");

    return info;
  }
}
