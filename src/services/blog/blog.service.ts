import { injectable, inject } from "inversify";
import {
  BlogInfo,
  CreateBlogResponse,
  GetBlogsParams,
  IBlog,
  IBlogRepository,
  IBlogService,
  UpdateBlogParams,
} from "../../interfaces/blog/blog.interface";
import { TYPES } from "../../constants";
import { IBlogLikesRepository } from "../../interfaces/blog/blog.likes.interface";
import { LikeType } from "../../types/blog/blog.types";
import { IBlogScores, IBlogScoresRepository } from "../../interfaces/blog/blog.scores.interface";

@injectable()
export class BlogService implements IBlogService {
  private entity: IBlog;
  private scoresEntity: IBlogScores;
  private repo: IBlogRepository;
  private blogLikes: IBlogLikesRepository;
  private scoresRepo: IBlogScoresRepository;

  constructor(
    @inject(TYPES.BlogModel) entity: IBlog,
    @inject(TYPES.BlogRepository) repo: IBlogRepository,
    @inject(TYPES.BlogLikesRepository) blogLikes: IBlogLikesRepository,
    @inject(TYPES.BlogScoresModel) scoresEntity: IBlogScores,
    @inject(TYPES.BlogScoresRepository) scoresRepo: IBlogScoresRepository
  ) {
    this.entity = entity;
    this.repo = repo;
    this.blogLikes = blogLikes;
    this.scoresEntity = scoresEntity;
    this.scoresRepo = scoresRepo;
  }

  async createBlog(userId: string): Promise<CreateBlogResponse> {
    return await this.repo.create(userId);
  }

  async getBlogs(params: GetBlogsParams): Promise<BlogInfo[]> {
    const tags = this.entity.validateTags(params.filters.tags);

    const data = await this.repo.getAll({
      ...params,
      filters: {
        ...params.filters,
        tags: tags,
      },
    });

    return data;
  }

  async getBlogInfo(userId: string, authorId: string, blogId: string): Promise<BlogInfo> {
    return await this.repo.get(userId, authorId, blogId);
  }

  async editBlog(params: UpdateBlogParams): Promise<BlogInfo> {
    const tags = this.entity.validateTags(params.tags);
    params.title && this.entity.validateBlogDesc(params.title);
    params.desc && this.entity.validateBlogDesc(params.desc);

    const data = await this.repo.update({
      ...params,
      tags: tags,
    });

    return data;
  }

  async deleteBlog(userId: string, blogId: string): Promise<string[]> {
    return await this.repo.delete(userId, blogId);
  }

  async toggleLike(userId: string, blogId: string): Promise<LikeType> {
    let type: LikeType = "UNLIKED";
    const blogLikeId = await this.blogLikes.get(userId, blogId);

    if (blogLikeId) type = await this.blogLikes.delete(userId, blogLikeId);
    else type = await this.blogLikes.create(userId, blogId);

    const scoreData = await this.scoresRepo.get("BLOG", blogId);

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
