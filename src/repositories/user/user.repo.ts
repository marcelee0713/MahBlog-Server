import { injectable } from "inversify";
import {
  IUserRepository,
  SignUpParams,
  UpdateUserParams,
} from "../../interfaces/user/user.interface";
import { UserData, GetUserParamsType, GetUserUseCase } from "../../types/user/user.types";
import { Prisma, PrismaClient } from "@prisma/client";
import { db } from "../../config/db";
import bcrypt from "bcryptjs";
import { CustomError } from "../../utils/error_handler";

@injectable()
export class UserRepository implements IUserRepository {
  private db: PrismaClient;

  constructor() {
    this.db = db;
  }

  async get<T extends GetUserUseCase>(params: GetUserParamsType<T>, type: T): Promise<UserData> {
    try {
      const user = await this.db.users.findFirst({
        where: {
          ...params,
          password: undefined,
        },
      });

      if (!user) throw new CustomError("does-not-exist", "User does not exist.");

      if (params.password && user.password) {
        const isMatch = await bcrypt.compare(params.password, user.password);

        if (!isMatch) throw new CustomError("wrong-credentials");
      }

      if (type === "SIGNING_IN" && !user.emailVerifiedAt) {
        throw new CustomError("user-not-verified");
      }

      // I don't know why the password is on the object when I don't even have
      // a password field on my interface "UserData" whenever I use the spread operator.
      return {
        userId: user.userId,
        email: user.email,
        role: user.role,
        status: user.status,
        emailVerifiedAt: user.emailVerifiedAt,
        createdAt: user.createdAt,
        authenticatedAs: user.authenticatedAs,
      };
    } catch (err) {
      if (err instanceof CustomError) throw err;

      throw new CustomError(
        "internal-server-error",
        "An internal server error occured when getting a user.",
        500,
        "UserRepository",
        `By getting a user data when using the use case: ${type}`
      );
    }
  }

  async create(params: SignUpParams): Promise<UserData> {
    try {
      const password =
        params.authAs === "LOCAL" ? await bcrypt.hash(params.password as string, 10) : null;

      const user = await this.db.users.create({
        data: {
          email: params.email,
          password,
          authenticatedAs: params.authAs,
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
        emailVerifiedAt: user.emailVerifiedAt,
      };
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") throw new CustomError("user-already-exist");
      }

      throw new CustomError(
        "internal-server-error",
        "An internal server error occured when creating a user.",
        500,
        "UserRepository",
        `By creating a user.`
      );
    }
  }

  async update(params: UpdateUserParams): Promise<void> {
    try {
      if (params.useCase === "CHANGE_EMAIL") {
        if (!params.email || !params.newEmail) throw new CustomError("missing-inputs");

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
        if (!params.password || !params.newPassword) throw new CustomError("missing-inputs");

        const user = await this.db.users.findFirst({
          where: {
            userId: params.userId,
          },
        });

        if (!user) throw new CustomError("does-not-exist", "User does not exist.");

        const currentUserPassword = user.password;

        if (user.authenticatedAs !== "LOCAL" || !currentUserPassword) {
          throw new CustomError(
            "invalid",
            `User can not change password due to authenticating as ${user.authenticatedAs}`
          );
        }

        const matchPassword = await bcrypt.compare(params.password, currentUserPassword);

        const samePassword = await bcrypt.compare(params.newPassword, currentUserPassword);

        if (!matchPassword) throw new CustomError("user-current-password-does-not-match");

        if (samePassword) throw new CustomError("user-enters-same-password");

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
        if (!params.email) throw new CustomError("missing-inputs");

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
        if (err.code === "P2025") {
          throw new CustomError("does-not-exist", "User does not exist.");
        }
      }

      if (err instanceof CustomError) throw err;

      throw new CustomError(
        "internal-server-error",
        "An internal server error occured when updating a user.",
        500,
        "UserRepository",
        `By updating a user data when using the use case: ${params.useCase}`
      );
    }
  }

  async delete(userId: string): Promise<void> {
    try {
      await this.db.users.delete({
        where: {
          userId: userId,
        },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2025") {
          throw new CustomError("does-not-exist", "User does not exist.");
        }
      }

      throw new CustomError(
        "internal-server-error",
        "An internal server error occured when deleting a user.",
        500,
        "UserRepository",
        `By deleting a user.`
      );
    }
  }
}
