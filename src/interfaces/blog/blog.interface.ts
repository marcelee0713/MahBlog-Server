import { BlogSortingOptions, BlogStatus, BlogVisibility } from "../../types/blog/blog.types";

export interface IBlog {
  validateBlogTitle: (title: string) => void;
  validateBlogDesc: (description: string) => void;
  validateTags: (tags: string[]) => string[];

  // TODO: Possibly add a businesss logic for calculating the Blog's Scores
  // TODO: Check desktop for the formula
}

export interface IBlogService {
  // TODO: When creating a blog for the first time
  // make sure to immediately create a Score Table and make it a the visibility to STATUS
  createBlog: (userId: string) => Promise<CreateBlogResponse>;

  // TODO: Handle pagination, sort by either "LATEST" | "OLDEST", and search query.
  getBlogs: (params: GetBlogsParams) => Promise<BlogInfo[]>;

  getBlogInfo: (userId: string, authorId: string, blogId: string) => Promise<BlogInfo>;

  getBlogContents: (userId: string, blogId: string) => Promise<BlogContent[]>;

  editBlog: (params: UpdateBlogParams) => Promise<BlogInfo>;

  editBlogContent: (params: UpdateBlogContentParams) => Promise<BlogContent>;

  // TODO: After this method make sure to also remove the image in the MediaService
  deleteContent: (params: DeleteBlogContentParams) => Promise<void>;

  // TODO An Array of imageUrls that is gathered through the Blog's Cover Image, and Blog's contentImages
  deleteBlog: (userId: string, blogId: string) => Promise<string[]>;

  // TODO: After liking or unliking the blog, update the score of the blog.
  // Think of something that we could return here. but probably we are not returning something.
  toggleLike: (userId: string, blogId: string) => Promise<void>;
}

// TODO: Do the full functionality of Blogs with its routers, controllers, and repository

export interface IBlogRepository {
  create: (userId: string) => Promise<CreateBlogResponse>;
  get: (userId: string, blogId: string) => Promise<BlogInfo>;
  // TODO: Create a getAlL function here also.
  update: (params: UpdateBlogParams) => Promise<BlogInfo>;
  delete: (userId: string, blogId: string) => Promise<void>;
}

export interface CreateBlogResponse {
  blogId: string;
  userId: string;
}

export interface GetBlogsParams {
  pagination: {
    skip: number;
    take: number;
  };
  filters: {
    searchQuery?: string;
    tags?: string[];
    sortBy: BlogSortingOptions;
  };
  userId?: string;
}

export interface UpdateBlogParams extends CreateBlogResponse {
  title: string;
  desc: string;
  coverImage?: string;
  tags: string[];
  visibility: BlogVisibility;
}

export interface UpdateBlogContentParams extends CreateBlogResponse {
  blogContentId: string;
  index: number;
  title?: string;
  desc?: string;
  contentImage?: string;
}

export interface DeleteBlogContentParams extends CreateBlogResponse {
  contentId: string;
}

export interface BlogInfo {
  blogId: string;
  authorId: string;
  title: string | null;
  description: string | null;
  coverImage: string | null;
  tags: string[];
  timestamps: {
    createdAt: Date;
    updatedAt: Date | null;
  };
  publicationDetails: {
    visibility: BlogVisibility;
    status: BlogStatus;
  };
  engagement: {
    likes: number;
    comments: number;
  };
  editable: boolean;
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
