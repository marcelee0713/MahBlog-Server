export interface IBlogCommentsService {
  createBlogComment: (params: CreateBlogCommentParams) => Promise<BlogCommentsData>;
  getBlogComments: (params: GetBlogCommentsParams) => Promise<BlogCommentsData[]>;
  updateBlogComment: (params: UpdateBlogCommentsParams) => Promise<BlogCommentsData>;
  deleteBlogComment: (commentId: string, userId: string) => Promise<void>;
}

export interface IBlogCommentsRepository {
  create: (params: CreateBlogCommentParams) => Promise<BlogCommentsData>;
  get: (params: GetBlogCommentsParams) => Promise<BlogCommentsData[]>;
  update: (params: UpdateBlogCommentsParams) => Promise<BlogCommentsData>;
  delete: (commentId: string, userId: string) => Promise<void>;
}

export interface BlogCommentsData {
  commentId: string;
  blogId: string;
  comment: string;
  details: {
    userId: string;
    fullName: string;
    profilePicture: string | null;
  };
  engagement: {
    likes: string[];
    replies: number;
  };
  timestamps: {
    createdAt: Date;
    updatedAt: Date | null;
  };
  editable: boolean;
}

export interface CreateBlogCommentParams {
  userId: string;
  blogId: string;
  comment: string;
}

export interface GetBlogCommentsParams {
  pagination: {
    skip: number;
    take: number;
  };
  authorId: string;
  blogId: string;
}

export interface UpdateBlogCommentsParams {
  userId: string;
  commentId: string;
  newComment: string;
}
