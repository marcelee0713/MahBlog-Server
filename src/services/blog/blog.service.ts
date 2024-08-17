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

@injectable()
export class BlogService implements IBlogService {
  private entity: IBlog;
  private repo: IBlogRepository;

  constructor(
    @inject(TYPES.BlogModel) entity: IBlog,
    @inject(TYPES.BlogRepository) repo: IBlogRepository
  ) {
    this.entity = entity;
    this.repo = repo;
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

  async toggleLike(userId: string, blogId: string): Promise<void> {}
}
