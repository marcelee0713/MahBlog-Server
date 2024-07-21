import { SortOrder } from "../../types";
import {
  CreateReportType,
  DeleteReportType,
  DeleteReportUseCase,
  GetReportReturnType,
  GetReportUseCase,
  ReportCategories,
  ReportType,
  UserReportData,
} from "../../types/user/user.reports.type";

export interface IUserReports {
  reportId: string;
  userId?: string;
  email?: string;
  description?: string;
  type: ReportType;
  category: ReportCategories;
  validateDesc: (desc?: string) => void;
}

export interface IUserReportsService {
  reportIssue: (params: CreateReportParams) => Promise<void>;
  reportUser: (params: ReportUserParams) => Promise<void>;
  reportBlog: (params: ReportBlogParams) => Promise<void>;
  reportComment: (params: ReportCommentParams) => Promise<void>;
  reportReply: (params: ReportReplyParams) => Promise<void>;
  getAllReports: (params: UserGetReportParams) => Promise<UserReportData[]>;
  getUserReports: (userId: string) => Promise<UserReportData[]>;
  getReport: (userId: string, reportId: string) => Promise<UserReportData>;
  deleteAllReports: () => Promise<void>;
  deleteUserReports: (userId: string) => Promise<void>;
  deleteReport: (userId: string, reportId: string) => Promise<void>;
}

export interface IUserReportsRepository {
  create: <T extends ReportType>(params: CreateReportType<T>, type: T) => Promise<void>;
  get: <T extends GetReportUseCase>(
    params: UserGetReportParams,
    type: T
  ) => Promise<GetReportReturnType<T>>;
  delete: <T extends DeleteReportUseCase>(params: DeleteReportType<T>, type: T) => Promise<void>;
}

export interface CreateReportParams {
  userId: string;
  description: string;
  email?: string;
  type: ReportType;
  category: ReportCategories;
}

export interface ReportUserParams extends CreateReportParams {
  reportedUserId: string;
}

export interface ReportBlogParams extends ReportUserParams {
  reportedBlogId: string;
}

export interface ReportCommentParams extends ReportBlogParams {
  reportedCommentId: string;
}

export interface ReportReplyParams extends ReportCommentParams {
  reportedReplyId: string;
}

export interface UserGetReportParams {
  userId?: string;
  reportId?: string;
  desc?: string;
  type?: ReportType;
  category?: ReportCategories;
  skip?: number;
  take?: number;
  dateOrder?: SortOrder;
}

export interface DeleteReportsParams {
  userId: string;
}

export interface DeleteReport extends DeleteReportsParams {
  reportId: string;
}
