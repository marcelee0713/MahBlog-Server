import { Prisma, PrismaClient } from "@prisma/client";
import { IUserSessionRepository } from "../interfaces/user/user.session.interface";
import { UserSessionData } from "../types/user/user.session.types";
import { db } from "../config/db";
import { ErrorType } from "../types";
import { injectable } from "inversify";
import { returnError } from "../utils/error_handler";

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
      throw new Error("internal-server-error" as ErrorType);
    }
  }

  async get(userId: string, sessionId: string): Promise<UserSessionData> {
    try {
      const data = await this.db.userSessions.findFirst({
        where: {
          sessionId: sessionId,
          userId: userId,
        },
      });

      if (!data) throw new Error("user-session-does-not-exist" as ErrorType);

      if (!data.userId) throw new Error("user-does-not-exist" as ErrorType);

      return {
        sessionId: data.sessionId,
        refreshToken: data.refreshToken,
        userId: data.userId,
        createdAt: data.createdAt,
        expiresAt: data.expiresAt,
      };
    } catch (err) {
      throw new Error(returnError(err));
    }
  }

  async delete(userId: string, sessionId: string): Promise<void> {
    try {
      await this.db.userSessions.delete({
        where: {
          userId: userId,
          sessionId: sessionId,
        },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2025") {
          throw new Error("user-session-does-not-exist" as ErrorType);
        }
      }

      throw new Error("internal-server-error" as ErrorType);
    }
  }
}
