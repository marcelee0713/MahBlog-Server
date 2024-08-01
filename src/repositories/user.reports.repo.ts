import { Prisma, PrismaClient } from "@prisma/client";
import {
  IUserReportsRepository,
  UserGetReportParams,
  UserReportDetails,
  UserReportGetAllData,
} from "../interfaces/user/user.reports.interface";
import {
  ReportType,
  CreateReportType,
  DeleteReportUseCase,
  DeleteReportType,
  UserReportData,
} from "../types/user/user.reports.type";
import { db } from "../config/db";
import { injectable } from "inversify";
import { CustomError } from "../utils/error_handler";

@injectable()
export class UserReportsRepository implements IUserReportsRepository {
  private db: PrismaClient;

  constructor() {
    this.db = db;
  }

  async create<T extends ReportType>(params: CreateReportType<T>, type: T): Promise<void> {
    try {
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
              users: {
                connect: {
                  userId: data.userId,
                },
              },
              details: {
                create: {
                  users: {
                    connect: {
                      userId: data.reportedUserId,
                    },
                  },
                },
              },
              category: data.category,
              description: data.description,
              type: data.type,
            },
          });

          break;
        }

        case "BLOG_REPORT": {
          const data = params as CreateReportType<"BLOG_REPORT">;

          await this.db.userReports.create({
            data: {
              users: {
                connect: {
                  userId: data.userId,
                },
              },
              details: {
                create: {
                  users: {
                    connect: {
                      userId: data.reportedUserId,
                    },
                  },
                  blogs: {
                    connect: {
                      blogId: data.reportedBlogId,
                    },
                  },
                },
              },
              category: data.category,
              description: data.description,
              type: data.type,
            },
          });
          break;
        }

        case "COMMENT_REPORT": {
          const data = params as CreateReportType<"COMMENT_REPORT">;

          await this.db.userReports.create({
            data: {
              users: {
                connect: {
                  userId: data.userId,
                },
              },
              details: {
                create: {
                  users: {
                    connect: {
                      userId: data.reportedUserId,
                    },
                  },
                  blogs: {
                    connect: {
                      blogId: data.reportedBlogId,
                    },
                  },
                  comments: {
                    connect: {
                      commentId: data.reportedCommentId,
                    },
                  },
                },
              },
              category: data.category,
              description: data.description,
              type: data.type,
            },
          });

          break;
        }

        case "REPLY_REPORT": {
          const data = params as CreateReportType<"REPLY_REPORT">;

          await this.db.userReports.create({
            data: {
              users: {
                connect: {
                  userId: data.userId,
                },
              },
              details: {
                create: {
                  users: {
                    connect: {
                      userId: data.reportedUserId,
                    },
                  },
                  blogs: {
                    connect: {
                      blogId: data.reportedBlogId,
                    },
                  },
                  comments: {
                    connect: {
                      commentId: data.reportedCommentId,
                    },
                  },
                  replies: {
                    connect: {
                      replyId: data.reportedReplyId,
                    },
                  },
                },
              },
              category: data.category,
              description: data.description,
              type: data.type,
            },
          });

          break;
        }
      }
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2025") {
          throw new CustomError(
            "does-not-exist",
            `An error occured because one of the details no longer exist.`,
            404,
            "UserReportsRepository",
            `By joining/combining tables that no longer exist.`
          );
        }
      }

      throw new CustomError(
        "internal-server-error",
        `An error occured when creating a report by using the type: ${type}.`,
        500,
        "UserReportsRepository",
        `By creating a ${type}`
      );
    }
  }

  async getAll(params: UserGetReportParams): Promise<UserReportGetAllData> {
    try {
      let filteredLength = 0;
      let length = 0;
      let tempData = [];

      tempData = await this.db.userReports.findMany({
        skip: params.skip,
        take: params.take,
        where: {
          category: params.category,
          userId: params.userId,
          type: params.type,
          description: {
            contains: params.desc,
            mode: "insensitive",
          },
        },
        orderBy: {
          createdAt: params.dateOrder ?? "desc",
        },
        include: {
          details: true,
        },
      });

      length = await this.db.userReports.count({
        where: {
          category: params.category,
          userId: params.userId,
          description: {
            contains: params.desc,
            mode: "insensitive",
          },
          type: params.type,
        },
      });

      filteredLength = tempData.length;

      const reports: UserReportData[] = [];

      tempData.forEach((val) => {
        reports.push(val);
      });

      const data: UserReportGetAllData = {
        reports: reports,
        filteredLength,
        length,
      };

      return data;
    } catch (err) {
      throw new CustomError(
        "internal-server-error",
        `An error occured when getting all reports.`,
        500,
        "UserReportsRepository"
      );
    }
  }

  async get(userId: string, reportId: string): Promise<UserReportData> {
    try {
      const data = await this.db.userReports.findFirst({
        where: {
          userId,
          reportId,
        },
        include: {
          details: true,
        },
      });

      if (!data) {
        throw new CustomError("does-not-exist", `User report does not exist`);
      }

      return data;
    } catch (err) {
      if (err instanceof CustomError) throw err;

      throw new CustomError(
        "internal-server-error",
        `An error occured when a report.`,
        500,
        "UserReportsRepository"
      );
    }
  }

  async delete<T extends DeleteReportUseCase>(params: DeleteReportType<T>, type: T): Promise<void> {
    try {
      switch (type) {
        case "ALL_REPORTS":
          await this.db.userReports.deleteMany({});
          break;

        case "ONE_REPORT": {
          if (params) {
            const data = params as DeleteReportType<"ONE_REPORT">;

            await this.db.userReports.delete({
              where: {
                userId: data.userId,
                reportId: data.reportId,
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
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2025") {
          throw new CustomError(
            "does-not-exist",
            `User report does not exist.`,
            404,
            "UserReportsRepository",
            `By doing the use case to delete: ${type}`
          );
        }
      }

      throw new CustomError(
        "internal-server-error",
        `An internal server error occured when doing the use case to delete ${type}.`,
        500,
        "UserReportsRepository",
        `By doing the use case to delete: ${type}`
      );
    }
  }
}
