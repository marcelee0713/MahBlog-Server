import { PrismaClient } from "@prisma/client";
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
import { ErrorType } from "../types";
import { injectable } from "inversify";

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
      throw new Error("internal-server-error" as ErrorType);
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
        const details: UserReportDetails | undefined = val.details
          ? {
              ...val.details,
              reportedUserId: val.details.reportedUserId ?? undefined,
              reportedBlogId: val.details.reportedBlogId ?? undefined,
              reportedCommentId: val.details.reportedCommentId ?? undefined,
              reportedReplyId: val.details.reportedReplyId ?? undefined,
            }
          : undefined;

        reports.push({
          ...val,
          userId: val.userId ?? undefined,
          email: val.email ?? undefined,
          details: details,
        });
      });

      const data: UserReportGetAllData = {
        reports: reports,
        filteredLength,
        length,
      };

      return data;
    } catch (err) {
      throw new Error("Not implemented");
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

      if (!data) throw Error("hehe");

      const details: UserReportDetails | undefined = data.details
        ? {
            ...data.details,
            reportedUserId: data.details.reportedUserId ?? undefined,
            reportedBlogId: data.details.reportedBlogId ?? undefined,
            reportedCommentId: data.details.reportedCommentId ?? undefined,
            reportedReplyId: data.details.reportedReplyId ?? undefined,
          }
        : undefined;

      return {
        ...data,
        userId: data.userId ?? undefined,
        email: data.email ?? undefined,
        details: details,
      };
    } catch (err) {
      throw new Error("Not implemented");
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
      console.log(err);
      throw new Error("internal-server-error" as ErrorType);
    }
  }
}
