import { SortOrder } from "../../types";
import { ReportCategories, ReportType, UserReportData } from "../../types/user/user.reports.type";

export interface IUserReports {
  validateDesc: (desc?: string) => void;
}

export interface IUserReportsService {
  reportIssue: (params: CreateReportParams) => Promise<void>;
  reportUser: (params: ReportUserParams) => Promise<void>;
  reportBlog: (params: ReportBlogParams) => Promise<void>;
  reportComment: (params: ReportCommentParams) => Promise<void>;
  reportReply: (params: ReportReplyParams) => Promise<void>;
  getAllReports: (params: UserGetReportParams) => Promise<UserReportData[]>;
  getUserReports: (userId: string) => Promise<UserReportData>;
  getReport: (userId: string, reportId: string) => Promise<UserReportData>;
  deleteAllReports: () => Promise<void>;
  deleteUserReports: (userId: string) => Promise<void>;
  deleteReport: (userId: string, reporteId: string) => Promise<void>;
}

export interface IUserReportsRepository {
  //TODO: Add a pagination getting the all reports and user's reports.
  // Complete the methods for this class/interface
}

export interface CreateReportParams {
  userId: string;
  desc: string;
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
  desc?: string;
  type?: ReportType;
  category?: ReportCategories;
  skip?: number;
  take?: number;
  dateOrder?: SortOrder;
}
