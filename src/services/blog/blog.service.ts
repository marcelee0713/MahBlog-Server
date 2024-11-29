import { injectable, inject } from "inversify";
import {
  BlogInfo,
  CreateBlogResponse,
  GetBlogsParams,
  IBlog,
  IBlogRepository,
  IBlogService,
  UpdateBlogParams,
} from "../../ts/interfaces/blog/blog.interface";
import { TYPES } from "../../constants";
import { ILikesRepository, LikesInfo } from "../../ts/interfaces/blog/blog.likes.interface";
import { IBlogScores, IBlogScoresRepository } from "../../ts/interfaces/blog/blog.scores.interface";

@injectable()
export class BlogService implements IBlogService {
  private entity: IBlog;
  private scoresEntity: IBlogScores;
  private repo: IBlogRepository;
  private likeRepo: ILikesRepository;
  private scoresRepo: IBlogScoresRepository;

  constructor(
    @inject(TYPES.BlogModel) entity: IBlog,
    @inject(TYPES.BlogRepository) repo: IBlogRepository,
    @inject(TYPES.LikesRepository) likeRepo: ILikesRepository,
    @inject(TYPES.BlogScoresModel) scoresEntity: IBlogScores,
    @inject(TYPES.BlogScoresRepository) scoresRepo: IBlogScoresRepository
  ) {
    this.entity = entity;
    this.repo = repo;
    this.likeRepo = likeRepo;
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

  async toggleLike(userId: string, blogId: string): Promise<LikesInfo> {
    let info: LikesInfo = {
      likedByUserId: userId,
      likeStatus: "UNLIKED",
    };

    const blogLikeId = await this.likeRepo.get(userId, blogId, "BLOG");

    if (blogLikeId) info.likeStatus = await this.likeRepo.delete(userId, blogLikeId, "BLOG");
    else info = await this.likeRepo.create({ userId, id: blogId, type: "BLOG" }, "BLOG");

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

    return info;
  }
}
