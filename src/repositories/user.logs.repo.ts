import { Prisma, PrismaClient } from "@prisma/client";
import { IUserLogsRepository } from "../interfaces/user/user.logs.interface";
import { ErrorType } from "../types";
import { LogType, UserLogData } from "../types/user/user.logs.types";
import { db } from "../config/db";
import { injectable } from "inversify";

@injectable()
export class UserLogsRepository implements IUserLogsRepository {
  private db: PrismaClient;

  constructor() {
    this.db = db;
  }

  async add(userId: string, type: LogType, content: string): Promise<void> {
    try {
      await this.db.userLogs.create({
        data: {
          userId: userId,
          content: content,
          type: type,
        },
      });
    } catch (err) {
      throw new Error("internal-server-error" as ErrorType);
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
      throw new Error("internal-server-error" as ErrorType);
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
      throw new Error("internal-server-error" as ErrorType);
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
          throw new Error("user-log-does-not-exist" as ErrorType);
        }
      }

      throw new Error("internal-server-error" as ErrorType);
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
          throw new Error("user-log-does-not-exist" as ErrorType);
        }
      }

      throw new Error("internal-server-error" as ErrorType);
    }
  }
}
