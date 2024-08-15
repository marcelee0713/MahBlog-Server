import { Prisma, PrismaClient } from "@prisma/client";
import { IUserSessionRepository } from "../../interfaces/user/user.session.interface";
import { UserSessionData } from "../../types/user/user.session.types";
import { db } from "../../config/db";
import { injectable } from "inversify";
import { CustomError } from "../../utils/error_handler";

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
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2025") {
          throw new CustomError(
            "does-not-exist",
            `An error occured because the user no longer exist.`,
            404,
            "UserSessionRepository",
            `By joining/combining tables that no longer exist.`
          );
        }
      }

      throw new CustomError(
        "internal-server-error",
        "An internal server error occured when creating a user session.",
        500,
        "UserSessionRepository",
        `By creating a user session`
      );
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

      if (!data) throw new CustomError("does-not-exist", "User session does not exist.");

      if (!data.userId) throw new CustomError("does-not-exist", "User does not exist.");

      return {
        sessionId: data.sessionId,
        refreshToken: data.refreshToken,
        userId: data.userId,
        createdAt: data.createdAt,
        expiresAt: data.expiresAt,
      };
    } catch (err) {
      if (err instanceof CustomError) throw err;

      throw new CustomError(
        "internal-server-error",
        "An internal server error occured when getting a user session data.",
        500,
        "UserRepository",
        `By getting user session data.`
      );
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
          throw new CustomError(
            "does-not-exist",
            `An error occured because either the user or session no longer exist.`,
            404,
            "UserSessionRepository",
            `By deleting tables that no longer exist.`
          );
        }
      }

      throw new CustomError(
        "internal-server-error",
        "An internal server error occured when deleting a user session data.",
        500,
        "UserRepository",
        `By deleting user session data.`
      );
    }
  }

  async deleteAll(userId: string): Promise<void> {
    try {
      await this.db.userSessions.deleteMany({
        where: {
          userId: userId,
        },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2025") {
          throw new CustomError(
            "does-not-exist",
            `An error occured because the user or no longer exist.`,
            404,
            "UserSessionRepository",
            `By user's sessions when the user no longer exist.`
          );
        }
      }

      throw new CustomError(
        "internal-server-error",
        "An internal server error occured when deleting a user's sessions.",
        500,
        "UserRepository",
        `By deleting user's sessions.`
      );
    }
  }
}
