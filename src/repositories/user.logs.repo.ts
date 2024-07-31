import { Prisma, PrismaClient } from "@prisma/client";
import { IUserLogsRepository } from "../interfaces/user/user.logs.interface";
import { LogType, UserLogData } from "../types/user/user.logs.types";
import { db } from "../config/db";
import { injectable } from "inversify";
import { CustomError } from "../utils/error_handler";

@injectable()
export class UserLogsRepository implements IUserLogsRepository {
  private db: PrismaClient;

  constructor() {
    this.db = db;
  }

  async create(userId: string, type: LogType, content: string): Promise<void> {
    try {
      await this.db.userLogs.create({
        data: {
          userId: userId,
          content: content,
          type: type,
        },
      });
    } catch (err) {
      throw new CustomError(
        "internal-server-error",
        "An internal server error occured when creating a user log.",
        500,
        "UserLogsRepository",
        "By creating a user log."
      );
    }
  }
  async get(userId: string, type?: LogType): Promise<UserLogData | null> {
    try {
      const log = await this.db.userLogs.findFirst({
        where: {
          userId: userId,
          type: type ?? undefined,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      if (!log) return null;

      return {
        ...log,
      };
    } catch (err) {
      throw new CustomError(
        "internal-server-error",
        "An internal server error occured when getting a user log.",
        500,
        "UserLogsRepository",
        "By getting a user log."
      );
    }
  }

  async getAll(userId: string, type?: LogType): Promise<UserLogData[]> {
    try {
      const logs = await this.db.userLogs.findMany({
        where: {
          userId: userId,
          type: type ?? undefined,
        },
      });

      return logs;
    } catch (err) {
      throw new CustomError(
        "internal-server-error",
        "An internal server error occured when getting a user logs.",
        500,
        "UserLogsRepository",
        `By getting a user logs and using the type: ${type}.`
      );
    }
  }

  async delete(logId: string, userId: string): Promise<void> {
    try {
      await this.db.userLogs.delete({
        where: {
          logId: logId,
          userId: userId,
        },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2025") {
          throw new CustomError("does-not-exist", "User log does not exist.", 404);
        }
      }

      throw new CustomError(
        "internal-server-error",
        "An internal server error occured when deleting a user log.",
        500,
        "UserLogsRepository",
        `By deleting a user log.`
      );
    }
  }

  async deleteAll(userId: string): Promise<void> {
    try {
      await this.db.userLogs.deleteMany({
        where: {
          userId: userId,
        },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2025") {
          throw new CustomError("does-not-exist", "User log does not exist.", 404);
        }
      }

      throw new CustomError(
        "internal-server-error",
        "An internal server error occured when deleting all user's logs.",
        500,
        "UserLogsRepository",
        `By deleting all user's logs.`
      );
    }
  }
}
