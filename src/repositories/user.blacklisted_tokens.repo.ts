import { Prisma, PrismaClient } from "@prisma/client";
import { IUserBlacklistedTokenRepository } from "../interfaces/user/user.blacklisted_token.interface";
import { ErrorType } from "../types";
import {
  UserBlackListedAddRepoParams,
  UserBlacklistedTokenData,
} from "../types/user/user.blacklisted_tokens.types";
import { db } from "../config/db";
import { injectable } from "inversify";

@injectable()
export class UserBlacklistedTokenRepository implements IUserBlacklistedTokenRepository {
  private db: PrismaClient;

  constructor() {
    this.db = db;
  }

  async add(data: UserBlackListedAddRepoParams): Promise<void> {
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
      throw new Error("internal-server-error" as ErrorType);
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
      throw new Error("internal-server-error" as ErrorType);
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
      throw new Error("internal-server-error" as ErrorType);
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
          throw new Error("user-blacklisted-token-does-not-exist" as ErrorType);
        }
      }

      throw new Error("internal-server-error" as ErrorType);
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
      throw new Error("internal-server-error" as ErrorType);
    }
  }
}
