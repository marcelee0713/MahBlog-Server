import { inject, injectable } from "inversify";
import {
  CreateReportParams,
  IUserReports,
  IUserReportsRepository,
  IUserReportsService,
  ReportBlogParams,
  ReportCommentParams,
  ReportReplyParams,
  ReportUserParams,
  UserGetReportParams,
} from "../../interfaces/user/user.reports.interface";
import { UserReportData } from "../../types/user/user.reports.type";
import { TYPES } from "../../constants";

@injectable()
export class UserReportsService implements IUserReportsService {
  private entity: IUserReports;
  private repo: IUserReportsRepository;

  constructor(
    @inject(TYPES.UserReportsModel) entity: IUserReports,
    @inject(TYPES.UserReportsRepository) repo: IUserReportsRepository
  ) {
    this.entity = entity;
    this.repo = repo;
  }

  async reportIssue(params: CreateReportParams): Promise<void> {
    this.entity.validateDesc(params.description);

    await this.repo.create(params, "ISSUE");
  }

  async reportUser(params: ReportUserParams): Promise<void> {
    this.entity.validateDesc(params.description);

    await this.repo.create(params, "USER_REPORT");
  }

  async reportBlog(params: ReportBlogParams): Promise<void> {
    this.entity.validateDesc(params.description);

    await this.repo.create(params, "BLOG_REPORT");
  }

  async reportComment(params: ReportCommentParams): Promise<void> {
    this.entity.validateDesc(params.description);

    await this.repo.create(params, "COMMENT_REPORT");
  }

  async reportReply(params: ReportReplyParams): Promise<void> {
    this.entity.validateDesc(params.description);

    await this.repo.create(params, "REPLY_REPORT");
  }

  async getAllReports(params: UserGetReportParams): Promise<UserReportData[]> {
    const reports = await this.repo.get(params, "ALL");

    return reports;
  }

  async getUserReports(userId: string): Promise<UserReportData[]> {
    const userReports = await this.repo.get({ userId }, "ALL");

    return userReports;
  }

  async getReport(userId: string, reportId: string): Promise<UserReportData> {
    const report = await this.repo.get(
      {
        userId,
        reportId,
      },
      "ONE"
    );

    return report;
  }

  async deleteAllReports(): Promise<void> {
    await this.repo.delete(undefined, "ALL_REPORTS");
  }

  async deleteUserReports(userId: string): Promise<void> {
    await this.repo.delete({ userId }, "USER_REPORTS");
  }

  async deleteReport(userId: string, reportId: string): Promise<void> {
    await this.repo.delete({ userId, reportId }, "ONE_REPORT");
  }
}
