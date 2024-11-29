import { ExcludeFunctions, RequestBody } from "..";
import {
  IUserReports,
  CreateReportParams,
  DeleteReport,
  DeleteReportsParams,
  CreateReportBlogParams,
  CreateReportCommentParams,
  CreateReportReplyParams,
  CreateReportUserParams,
  GetUserReportParams,
  UserReportDetails,
  UserReportsData,
} from "../../interfaces/user/user.reports.interface";

export type UserReportData = ExcludeFunctions<IUserReports> & {
  details: UserReportDetails | null;
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

export type CreateReportParamsType<T extends ReportType> = ParamMapping[T];

export type CreateUserReportIssueBodyReq = RequestBody<CreateReportParams>;

export type CreateUserReportUserBodyReq = RequestBody<CreateReportUserParams>;

export type CreateUserReportBlogBodyReq = RequestBody<CreateReportBlogParams>;

export type CreateUserReportCommentBodyReq = RequestBody<CreateReportCommentParams>;

export type CreateUserReportReplyBodyReq = RequestBody<CreateReportReplyParams>;

export type GetUserReportBodyReq = RequestBody<GetUserReportParams>;

export type GetReportUseCase = "ONE" | "ALL";

export type GetReportReturnType<T extends GetReportUseCase> = GetParamMapping[T];

export type DeleteReportUseCase = "ALL_REPORTS" | "USER_REPORTS" | "ONE_REPORT";

export type DeleteReportType<T extends DeleteReportUseCase> = DeleteParamMapping[T];

type DeleteParamMapping = {
  ALL_REPORTS: undefined;
  USER_REPORTS: DeleteReportsParams;
  ONE_REPORT: DeleteReport;
};

type GetParamMapping = {
  ONE: UserReportData;
  ALL: UserReportsData;
};

type ParamMapping = {
  ISSUE: CreateReportParams;
  USER_REPORT: CreateReportUserParams;
  BLOG_REPORT: CreateReportBlogParams;
  COMMENT_REPORT: CreateReportCommentParams;
  REPLY_REPORT: CreateReportReplyParams;
};
