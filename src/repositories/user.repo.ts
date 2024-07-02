import { injectable } from "inversify";
import { IUserRepository, SignInParams, UserUpdateParams } from "../interfaces/user/user.interface";
import { UserData } from "../types/user/user.types";
import { Prisma, PrismaClient } from "@prisma/client";
import { db } from "../config/db";
import bycrpt from "bcrypt";
import { ErrorType } from "../types";
import { returnError } from "../utils/error_handler";

@injectable()
export class UserRepository implements IUserRepository {
  private db: PrismaClient;

  constructor() {
    this.db = db;
  }

  async createUser(params: SignInParams): Promise<void> {
    try {
      await this.db.users.create({
        data: {
          email: params.email,
          password: await bycrpt.hash(params.password, 10),
          profile: {
            create: {
              firstName: params.firstName,
              lastName: params.lastName,
            },
          },
        },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") throw new Error("user-already-exist" as ErrorType);
      }

      throw new Error(returnError(err));
    }
  }

  async getUserData(userId?: string, email?: string): Promise<UserData> {
    try {
      const user = await this.db.users.findFirst({
        where: {
          email: email,
        },
      });

      if (!user) throw new Error("user-does-not-exist" as ErrorType);

      return {
        ...user,
        emailVerifiedAt: user.emailVerifiedAt ?? undefined,
      };
    } catch (err) {
      throw new Error(returnError(err));
    }
  }

  async updateUserData(params: UserUpdateParams): Promise<void> {
    try {
      if (params.useCase === "CHANGE_EMAIL") {
        await this.db.users.update({
          where: {
            userId: params.userId,
          },
          data: {
            email: params.email,
          },
        });

        return;
      }

      if (params.useCase === "CHANGE_PASSWORD") {
        if (!params.password) throw new Error("missing-inputs" as ErrorType);

        await this.db.users.update({
          where: {
            userId: params.userId,
          },
          data: {
            password: await bycrpt.hash(params.password, 10),
          },
        });

        return;
      }

      if (params.useCase === "VERIFY_EMAIL") {
        if (!params.password) throw new Error("missing-inputs" as ErrorType);

        await this.db.users.update({
          where: {
            userId: params.userId,
          },
          data: {
            emailVerifiedAt: new Date(),
          },
        });
      }
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2001") {
          throw new Error("user-does-not-exist" as ErrorType);
        }
      }

      throw new Error(returnError(err));
    }
  }

  async deleteUser(userId: string): Promise<void> {
    try {
      await this.db.users.delete({
        where: {
          userId: userId,
        },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2001") {
          throw new Error("user-does-not-exist" as ErrorType);
        }
      }

      throw new Error(returnError(err));
    }
  }
}
