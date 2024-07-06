import { PrismaClient } from "@prisma/client";
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
  async get(userId: string, type: LogType): Promise<UserLogData | null> {
    try {
      const log = await this.db.userLogs.findFirst({
        where: {
          userId: userId,
          type: type,
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
}
