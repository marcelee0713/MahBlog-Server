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

@injectable()
export class BlogCommentsService implements IBlogCommentsService {
  private repo: IBlogCommentsRepository;

  constructor(@inject(TYPES.BlogCommentsRepository) repo: IBlogCommentsRepository) {
    this.repo = repo;
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

  async deleteBlogComment(commentId: string, userId: string): Promise<void> {
    return await this.repo.delete(commentId, userId);
  }
}
