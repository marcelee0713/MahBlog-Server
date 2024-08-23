import { inject, injectable } from "inversify";
import {
  BlogContent,
  CreateBlogContentResponse,
  DeleteBlogContentParams,
  IBlogContents,
  IBlogContentsRepository,
  IBlogContentsService,
  UpdateBlogContentParams,
} from "../../interfaces/blog/blog.contents.interface";
import { TYPES } from "../../constants";

@injectable()
export class BlogContentsService implements IBlogContentsService {
  private entity: IBlogContents;
  private repo: IBlogContentsRepository;

  constructor(
    @inject(TYPES.BlogContentsModel) entity: IBlogContents,
    @inject(TYPES.BlogContentsRepository) repo: IBlogContentsRepository
  ) {
    this.entity = entity;
    this.repo = repo;
  }

  async createBlogContent(userId: string, blogId: string): Promise<CreateBlogContentResponse> {
    return await this.repo.create(userId, blogId);
  }

  async getBlogContents(blogId: string): Promise<BlogContent[]> {
    return await this.repo.getAll(blogId);
  }

  async getBlogContent(blogId: string, blogContentId: string): Promise<BlogContent> {
    return await this.repo.get(blogId, blogContentId);
  }

  async editBlogContent(params: UpdateBlogContentParams): Promise<BlogContent> {
    params.title && this.entity.validateBlogContentTitle(params.title);

    return await this.repo.update(params);
  }

  async deleteContent(params: DeleteBlogContentParams): Promise<string | null> {
    return await this.repo.delete(params);
  }
}
