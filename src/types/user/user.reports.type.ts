import { ExcludeFunctions, RequestBody } from "..";
import {
  CreateReportParams,
  DeleteReport,
  DeleteReportsParams,
  IUserReports,
  ReportBlogParams,
  ReportCommentParams,
  ReportReplyParams,
  ReportUserParams,
  UserGetReportParams,
  UserReportDetails,
  UserReportGetAllData,
} from "../../interfaces/user/user.reports.interface";

export type UserReportData = ExcludeFunctions<IUserReports> & {
  details?: UserReportDetails;
};

export const ReportTypeArr = [
  "ISSUE",
  "USER_REPORT",
  "BLOG_REPORT",
  "COMMENT_REPORT",
  "REPLY_REPORT",
] as const;

export const ReportCategoriesArr = [
  "BUG",
  "INAPPROPRIATE_BLOG",
  "SPAM",
  "HARASSMENT",
  "COPYRIGHT_VIOLATION",
  "FAKE_NEWS",
  "HATE_SPEECH",
  "IMPERSONATION",
  "PHISHING",
  "MALWARE",
  "OTHER",
] as const;

export type ReportType = (typeof ReportTypeArr)[number];

export type ReportCategories = (typeof ReportCategoriesArr)[number];

export type CreateReportType<T extends ReportType> = ParamMapping[T];

export type GetReportUseCase = "ONE" | "ALL";

export type GetReportReturnType<T extends GetReportUseCase> = GetParamMapping[T];

export type DeleteReportUseCase = "ALL_REPORTS" | "USER_REPORTS" | "ONE_REPORT";

export type DeleteReportType<T extends DeleteReportUseCase> = DeleteParamMapping[T];

export type UserCreateReportIssueBodyReq = RequestBody<CreateReportParams>;

export type UserCreateReportUserBodyReq = RequestBody<ReportUserParams>;

export type UserCreateReportBlogBodyReq = RequestBody<ReportBlogParams>;

export type UserCreateReportCommentBodyReq = RequestBody<ReportCommentParams>;

export type UserCreateReportReplyBodyReq = RequestBody<ReportReplyParams>;

export type UserGetReportBodyReq = RequestBody<UserGetReportParams>;

type DeleteParamMapping = {
  ALL_REPORTS: undefined;
  USER_REPORTS: DeleteReportsParams;
  ONE_REPORT: DeleteReport;
};

type GetParamMapping = {
  ONE: UserReportData;
  ALL: UserReportGetAllData;
};

type ParamMapping = {
  ISSUE: CreateReportParams;
  USER_REPORT: ReportUserParams;
  BLOG_REPORT: ReportBlogParams;
  COMMENT_REPORT: ReportCommentParams;
  REPLY_REPORT: ReportReplyParams;
};
