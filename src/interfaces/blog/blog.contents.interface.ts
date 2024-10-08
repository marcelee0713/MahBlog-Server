export interface IBlogContents {
  validateBlogContentTitle: (title: string) => void;
}

export interface IBlogContentsService {
  createBlogContent: (userId: string, blogId: string) => Promise<CreateBlogContentResponse>;

  getBlogContent: (blogId: string, blogContentId: string) => Promise<BlogContent>;

  getBlogContents: (blogId: string) => Promise<BlogContent[]>;

  editBlogContent: (params: UpdateBlogContentParams) => Promise<BlogContent>;

  deleteContent: (params: DeleteBlogContentParams) => Promise<string | null>;
}

export interface IBlogContentsRepository {
  create: (userId: string, blogId: string) => Promise<CreateBlogContentResponse>;

  get: (blogId: string, blogContentId: string) => Promise<BlogContent>;

  getAll: (blogId: string) => Promise<BlogContent[]>;

  update: (params: UpdateBlogContentParams) => Promise<BlogContent>;

  delete: (params: DeleteBlogContentParams) => Promise<string | null>;
}

export interface BlogContent {
  blogContentId: string;
  blogId: string;
  index: number;
  title: string | null;
  description: string | null;
  contentImage: string | null;
  createdAt: Date;
}

export interface CreateBlogContentResponse {
  blogContentId: string;
  blogId: string;
  userId: string;
}

export interface UpdateBlogContentParams {
  userId: string;
  blogId: string;
  blogContentId: string;
  index?: number;
  title?: string | null;
  description?: string | null;
  contentImage?: string | null;
}

export interface DeleteBlogContentParams extends CreateBlogContentResponse {}
