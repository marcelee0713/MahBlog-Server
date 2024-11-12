import { inject, injectable } from "inversify";
import {
  BlogCommentsData,
  CreateBlogCommentParams,
  GetBlogCommentsParams,
  IBlogCommentsRepository,
  IBlogCommentsService,
  UpdateBlogCommentsParams,
} from "../../interfaces/blog/blog.comments.interface";
import { TYPES } from "../../constants";
import { IBlogScores, IBlogScoresRepository } from "../../interfaces/blog/blog.scores.interface";
import { ILikesRepository, LikesInfo } from "../../interfaces/blog/blog.likes.interface";

@injectable()
export class BlogCommentsService implements IBlogCommentsService {
  private scoresEntity: IBlogScores;
  private repo: IBlogCommentsRepository;
  private scoresRepo: IBlogScoresRepository;
  private likeRepo: ILikesRepository;

  constructor(
    @inject(TYPES.BlogScoresModel) scoresEntity: IBlogScores,
    @inject(TYPES.BlogCommentsRepository) repo: IBlogCommentsRepository,
    @inject(TYPES.BlogScoresRepository) scoresRepo: IBlogScoresRepository,
    @inject(TYPES.LikesRepository) likeRepo: ILikesRepository
  ) {
    this.scoresEntity = scoresEntity;
    this.repo = repo;
    this.scoresRepo = scoresRepo;
    this.likeRepo = likeRepo;
  }

  async createBlogComment(params: CreateBlogCommentParams): Promise<BlogCommentsData> {
    return await this.repo.create(params);
  }

  async getBlogComments(params: GetBlogCommentsParams): Promise<BlogCommentsData[]> {
    return await this.repo.getAll(params);
  }

  async updateBlogComment(params: UpdateBlogCommentsParams): Promise<BlogCommentsData> {
    return await this.repo.update(params);
  }

  async deleteBlogComment(userId: string, commentId: string): Promise<void> {
    return await this.repo.delete(userId, commentId);
  }

  async toggleLike(userId: string, commentId: string): Promise<LikesInfo> {
    let info: LikesInfo = {
      likedByUserId: userId,
      likeStatus: "UNLIKED",
    };

    const commentLikeId = await this.likeRepo.get(userId, commentId, "COMMENT");

    if (commentLikeId)
      info.likeStatus = await this.likeRepo.delete(userId, commentLikeId, "COMMENT");
    else info = await this.likeRepo.create({ userId, id: commentId, type: "COMMENT" }, "COMMENT");

    const scoreData = await this.scoresRepo.get("COMMENT", commentId);

    const result = this.scoresEntity.calculate(
      scoreData.likes,
      scoreData.comments,
      scoreData.createdAt
    );

    await this.scoresRepo.update({
      bestScore: result.bestScore,
      controversialScore: result.controversialScore,
      scoresId: scoreData.scoresId,
      type: scoreData.type,
    });

    return info;
  }
}
