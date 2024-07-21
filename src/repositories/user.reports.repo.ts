import { PrismaClient } from "@prisma/client";
import {
  IUserReportsRepository,
  UserGetReportParams,
} from "../interfaces/user/user.reports.interface";
import {
  ReportType,
  CreateReportType,
  GetReportUseCase,
  GetReportReturnType,
  DeleteReportUseCase,
  DeleteReportType,
} from "../types/user/user.reports.type";
import { db } from "../config/db";

export class UserReportsRepository implements IUserReportsRepository {
  private db: PrismaClient;

  constructor() {
    this.db = db;
  }

  async create<T extends ReportType>(params: CreateReportType<T>, type: T): Promise<void> {
    switch (type) {
      case "ISSUE": {
        const data = params as CreateReportType<"ISSUE">;

        await this.db.userReports.create({
          data: data,
        });

        break;
      }

      case "USER_REPORT": {
        const data = params as CreateReportType<"USER_REPORT">;

        await this.db.userReports.create({
          data: {
            ...data,
            details: {
              create: {
                reportedUserId: data.reportedUserId,
              },
            },
          },
        });

        break;
      }

      case "BLOG_REPORT": {
        const data = params as CreateReportType<"BLOG_REPORT">;

        await this.db.userReports.create({
          data: {
            ...data,
            details: {
              create: {
                reportedUserId: data.reportedUserId,
                reportedBlogId: data.reportedBlogId,
              },
            },
          },
        });
        break;
      }

      case "COMMENT_REPORT": {
        const data = params as CreateReportType<"COMMENT_REPORT">;

        await this.db.userReports.create({
          data: {
            ...data,
            details: {
              create: {
                reportedUserId: data.reportedUserId,
                reportedBlogId: data.reportedBlogId,
                reportedCommentId: data.reportedCommentId,
              },
            },
          },
        });

        break;
      }

      case "REPLY_REPORT": {
        const data = params as CreateReportType<"REPLY_REPORT">;

        await this.db.userReports.create({
          data: {
            ...data,
            details: {
              create: {
                reportedUserId: data.reportedUserId,
                reportedBlogId: data.reportedBlogId,
                reportedCommentId: data.reportedCommentId,
                reportedReplyId: data.reportedReplyId,
              },
            },
          },
        });

        break;
      }
    }
  }

  async get<T extends GetReportUseCase>(
    params: UserGetReportParams,
    type: T
  ): Promise<GetReportReturnType<T>> {
    throw new Error("Not implemented");

    //TODO: Check out the old project Finia in order to know how to apply filter, pagination, and etc...
  }

  async delete<T extends DeleteReportUseCase>(params: DeleteReportType<T>, type: T): Promise<void> {
    switch (type) {
      case "ALL_REPORTS":
        await this.db.userReports.deleteMany({});
        break;

      case "ONE_REPORT": {
        if (params) {
          const data = params as DeleteReportType<"ONE_REPORT">;

          await this.db.userReports.delete({
            where: {
              ...data,
            },
          });
        }

        break;
      }

      case "USER_REPORTS": {
        if (params) {
          const data = params as DeleteReportType<"USER_REPORTS">;

          await this.db.userReports.deleteMany({
            where: {
              userId: data.userId,
            },
          });
        }

        break;
      }
    }
  }
}
