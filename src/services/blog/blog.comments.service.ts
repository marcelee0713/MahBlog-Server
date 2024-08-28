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
import { LikeType } from "../../types/blog/blog.types";
import { IBlogScores, IBlogScoresRepository } from "../../interfaces/blog/blog.scores.interface";
import { IBlogCommentLikesRepository } from "../../interfaces/blog/blog.likes.interface";

@injectable()
export class BlogCommentsService implements IBlogCommentsService {
  private scoresEntity: IBlogScores;
  private repo: IBlogCommentsRepository;
  private scoresRepo: IBlogScoresRepository;
  private likeRepo: IBlogCommentLikesRepository;

  constructor(
    @inject(TYPES.BlogScoresModel) scoresEntity: IBlogScores,
    @inject(TYPES.BlogCommentsRepository) repo: IBlogCommentsRepository,
    @inject(TYPES.BlogScoresRepository) scoresRepo: IBlogScoresRepository,
    @inject(TYPES.BlogCommentLikesRepository) likeRepo: IBlogCommentLikesRepository
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

  async toggleLike(userId: string, commentId: string): Promise<LikeType> {
    let type: LikeType = "UNLIKED";
    const commentLikeId = await this.likeRepo.get(userId, commentId);

    if (commentLikeId) type = await this.likeRepo.delete(userId, commentLikeId);
    else type = await this.likeRepo.create(userId, commentId);

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

    return type;
  }
}
