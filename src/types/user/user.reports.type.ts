import { ExcludeFunctions } from "..";
import { IUserReports } from "../../interfaces/user/user.reports.interface";

export type UserReportData = ExcludeFunctions<IUserReports>;

export const ReportTypeArr = [
  "ISSUE",
  "USER_REPORT",
  "BLOG_REPORT",
  "COMMENT_REPORT",
  "REPLY_REPORT",
] as const;

export type ReportType = (typeof ReportTypeArr)[number];

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

export type ReportCategories = (typeof ReportTypeArr)[number];
