import { Prisma, PrismaClient } from "@prisma/client";
import { IUserSessionRepository } from "../interfaces/user/user.session.interface";
import { UserSessionData } from "../types/user/user.session.types";
import { db } from "../config/db";
import { ErrorType } from "../types";
import { injectable } from "inversify";

@injectable()
export class UserSessionRepository implements IUserSessionRepository {
  private db: PrismaClient;

  constructor() {
    this.db = db;
  }

  async create(params: UserSessionData): Promise<void> {
    try {
      await this.db.userSessions.create({
        data: {
          createdAt: params.createdAt,
          expiresAt: params.expiresAt,
          sessionId: params.sessionId,
          refreshToken: params.refreshToken,
          users: {
            connect: {
              userId: params.userId,
            },
          },
        },
      });
    } catch (err) {
      console.log(err);
      throw new Error("internal-server-error" as ErrorType);
    }
  }

  async delete(userId: string, sessionId: string): Promise<void> {}
}
