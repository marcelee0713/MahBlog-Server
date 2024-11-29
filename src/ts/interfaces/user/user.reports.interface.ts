import { SortOrder } from "../../types";
import {
  CreateReportParamsType,
  DeleteReportType,
  DeleteReportUseCase,
  ReportCategories,
  ReportType,
  UserReportData,
} from "../../types/user/user.reports.type";

export interface IUserReports {
  reportId: string;
  userId?: string | null;
  email?: string | null;
  description?: string;
  type: ReportType;
  category: ReportCategories;
  validateDesc: (desc?: string) => void;
}

export interface IUserReportsService {
  reportIssue: (params: CreateReportParams) => Promise<void>;
  reportUser: (params: CreateReportUserParams) => Promise<void>;
  reportBlog: (params: CreateReportBlogParams) => Promise<void>;
  reportComment: (params: CreateReportCommentParams) => Promise<void>;
  reportReply: (params: CreateReportReplyParams) => Promise<void>;
  getAllReports: (params: GetUserReportParams) => Promise<UserReportsData>;
  getReport: (userId: string, reportId: string) => Promise<UserReportData>;
  deleteAllReports: () => Promise<void>;
  deleteUserReports: (userId: string) => Promise<void>;
  deleteReport: (userId: string, reportId: string) => Promise<void>;
}

export interface IUserReportsRepository {
  create: <T extends ReportType>(params: CreateReportParamsType<T>, type: T) => Promise<void>;
  get: (userId: string, reportId: string) => Promise<UserReportData>;
  getAll: (params: GetUserReportParams) => Promise<UserReportsData>;
  delete: <T extends DeleteReportUseCase>(params: DeleteReportType<T>, type: T) => Promise<void>;
}

export interface CreateReportParams {
  userId?: string;
  description: string;
  email?: string;
  type: ReportType;
  category: ReportCategories;
}

export interface CreateReportUserParams extends CreateReportParams {
  reportedUserId: string;
}

export interface CreateReportBlogParams extends CreateReportUserParams {
  reportedBlogId: string;
}

export interface CreateReportCommentParams extends CreateReportBlogParams {
  reportedCommentId: string;
}

export interface CreateReportReplyParams extends CreateReportCommentParams {
  reportedReplyId: string;
}

export interface GetUserReportParams {
  userId?: string;
  reportId?: string;
  desc?: string;
  type?: ReportType;
  category?: ReportCategories;
  skip?: number;
  take?: number;
  dateOrder?: SortOrder;
}

export interface UserReportDetails {
  reportDetailId: string;
  reportId: string;
  reportedUserId: string | null;
  reportedBlogId: string | null;
  reportedCommentId: string | null;
  reportedReplyId: string | null;
}

export interface UserReportsData {
  reports: UserReportData[];
  length: number;
  filteredLength: number;
}

export interface DeleteReportsParams {
  userId: string;
}

export interface DeleteReport extends DeleteReportsParams {
  reportId: string;
}
