import { injectable } from "inversify";
import { IUserRepository, SignInParams, UserUpdateParams } from "../interfaces/user/user.interface";
import { UserData, UserGetType, UserGetUseCase } from "../types/user/user.types";
import { Prisma, PrismaClient } from "@prisma/client";
import { db } from "../config/db";
import bcrypt from "bcrypt";
import { ErrorType } from "../types";
import { returnError } from "../utils/error_handler";

@injectable()
export class UserRepository implements IUserRepository {
  private db: PrismaClient;

  constructor() {
    this.db = db;
  }

  async getUserData<T extends UserGetUseCase>(params: UserGetType<T>, type: T): Promise<UserData> {
    try {
      const user = await this.db.users.findFirst({
        where: {
          ...params,
          password: undefined,
        },
      });

      if (!user) throw new Error("user-does-not-exist" as ErrorType);

      if (params.password) {
        const isMatch = await bcrypt.compare(params.password, user.password);

        if (!isMatch) throw new Error("wrong-credentials" as ErrorType);
      }

      if (type === "SIGNING_IN" && !user.emailVerifiedAt) {
        throw new Error("user-not-verified" as ErrorType);
      }

      // I don't know why the password is on the object when I don't even have
      // a password field on my interface "UserData" whenever I use the spread operator.
      return {
        userId: user.userId,
        email: user.email,
        role: user.role,
        status: user.status,
        emailVerifiedAt: user.emailVerifiedAt ?? undefined,
        createdAt: user.createdAt,
      };
    } catch (err) {
      throw new Error(returnError(err));
    }
  }

  async createUser(params: SignInParams): Promise<UserData> {
    try {
      const user = await this.db.users.create({
        data: {
          email: params.email,
          password: await bcrypt.hash(params.password, 10),
          profile: {
            create: {
              firstName: params.firstName,
              lastName: params.lastName,
            },
          },
        },
      });

      return {
        ...user,
        emailVerifiedAt: user.emailVerifiedAt ?? undefined,
      };
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") throw new Error("user-already-exist" as ErrorType);
      }

      throw new Error(returnError(err));
    }
  }

  async updateUserData(params: UserUpdateParams): Promise<void> {
    try {
      if (params.useCase === "CHANGE_EMAIL") {
        if (!params.email || !params.newEmail) throw new Error("missing-inputs" as ErrorType);

        await this.db.users.update({
          where: {
            email: params.email,
            userId: params.userId,
          },
          data: {
            email: params.newEmail,
            emailVerifiedAt: null,
          },
        });

        return;
      }

      if (params.useCase === "CHANGE_PASSWORD") {
        if (!params.password || !params.newPassword) throw new Error("missing-inputs" as ErrorType);

        const user = await this.db.users.findFirst({
          where: {
            userId: params.userId,
          },
        });

        if (!user) throw new Error("user-does-not-exist" as ErrorType);

        const matchPassword = await bcrypt.compare(params.password, user.password);

        const samePassword = await bcrypt.compare(params.newPassword, user.password);

        if (!matchPassword) throw new Error("user-current-password-does-not-match" as ErrorType);

        if (samePassword) throw new Error("user-enters-same-password" as ErrorType);

        await this.db.users.update({
          where: {
            userId: params.userId,
          },
          data: {
            password: await bcrypt.hash(params.newPassword, 10),
          },
        });

        return;
      }

      if (params.useCase === "VERIFY_EMAIL") {
        if (!params.email) throw new Error("missing-inputs" as ErrorType);

        await this.db.users.update({
          where: {
            userId: params.userId,
            email: params.email,
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