import { Prisma, PrismaClient } from "@prisma/client";
import { IUserBlacklistedTokenRepository } from "../interfaces/user/user.blacklisted_token.interface";
import {
  CreateUserBlackListedRepoParams,
  UserBlacklistedTokenData,
} from "../types/user/user.blacklisted_tokens.types";
import { db } from "../config/db";
import { injectable } from "inversify";
import { CustomError } from "../utils/error_handler";

@injectable()
export class UserBlacklistedTokenRepository implements IUserBlacklistedTokenRepository {
  private db: PrismaClient;

  constructor() {
    this.db = db;
  }

  async create(data: CreateUserBlackListedRepoParams): Promise<void> {
    try {
      await this.db.userBlacklistedTokens.create({
        data: {
          createdAt: data.createdAt,
          expiresAt: data.expiresAt,
          token: data.token,
          holderId: data.userId,
        },
      });
    } catch (err) {
      throw new CustomError(
        "internal-server-error",
        "An internal server error occured when creating a blacklisted token",
        500,
        "UserBlacklistedTokensRepository",
        "By creating a blacklisted token"
      );
    }
  }

  async get(userId: string, token: string): Promise<UserBlacklistedTokenData | null> {
    try {
      const data = await this.db.userBlacklistedTokens.findFirst({
        where: {
          holderId: userId,
          token: token,
        },
      });

      if (!data || !data.holderId) return null;

      return {
        createdAt: data.createdAt,
        expiresAt: data.expiresAt,
        holderId: data.holderId,
        token: data.token,
      };
    } catch (err) {
      throw new CustomError(
        "internal-server-error",
        "An internal server error occured when getting a blacklisted token",
        500,
        "UserBlacklistedTokensRepository",
        "By getting a blacklisted token"
      );
    }
  }

  async getAll(userId?: string): Promise<UserBlacklistedTokenData[]> {
    try {
      const data = await this.db.userBlacklistedTokens.findMany({
        where: {
          holderId: userId ?? undefined,
        },
      });

      if (data.length === 0) return [];

      const newData: UserBlacklistedTokenData[] = [];

      data.forEach((val) => {
        newData.push({
          holderId: val.holderId as string,
          token: val.token,
          createdAt: val.createdAt,
          expiresAt: val.expiresAt,
        });
      });

      return newData;
    } catch (err) {
      throw new CustomError(
        "internal-server-error",
        "An internal server error occured when getting all the user's blacklisted tokens",
        500,
        "UserBlacklistedTokensRepository",
        "By getting all the user's blacklisted tokens"
      );
    }
  }

  async deleteToken(token: string): Promise<void> {
    try {
      await this.db.userBlacklistedTokens.delete({
        where: {
          token: token,
        },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2025") {
          throw new CustomError("does-not-exist", "Blacklisted token does not exist", 404);
        }
      }

      throw new CustomError(
        "internal-server-error",
        "An internal server error occured when deleting a blacklisted token",
        500,
        "UserBlacklistedTokensRepository",
        "By deleting a blacklisted token"
      );
    }
  }

  async deleteExpiredTokens(tokens: string[]): Promise<void> {
    try {
      await this.db.userBlacklistedTokens.deleteMany({
        where: {
          token: {
            in: tokens,
          },
        },
      });
    } catch (err) {
      throw new CustomError(
        "internal-server-error",
        "An internal server error occured when deleting a expired blacklisted tokens",
        500,
        "UserBlacklistedTokensRepository",
        "By deleting expired blacklisted tokens"
      );
    }
  }
}
