import { injectable } from "inversify";
import {
  IUserRepository,
  SignUpParams,
  UpdateUserParams,
} from "../../ts/interfaces/user/user.interface";
import { UserData, GetUserParamsType, GetUserUseCase } from "../../ts/types/user/user.types";
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
      const user = await this.db.users.findFirst({
        where: {
          userId: params.userId,
        },
      });

      if (!user) throw new CustomError("does-not-exist", "User does not exist.");

      if (params.useCase === "CHANGE_EMAIL") {
        if (!params.email || !params.newEmail)
          throw new CustomError(
            "missing-inputs",
            "Missing email and newEmail in the request body."
          );

        if (user.authenticatedAs !== "LOCAL") {
          throw new CustomError(
            "user-modification-denied",
            `User can not change email due to authenticating as ${user.authenticatedAs}`
          );
        }

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
      }

      if (params.useCase === "CHANGE_PASSWORD") {
        if (!params.password || !params.newPassword)
          throw new CustomError(
            "missing-inputs",
            "Missing password and newPassword in request body."
          );

        const currentUserPassword = user.password;

        if (user.authenticatedAs !== "LOCAL" || !currentUserPassword) {
          throw new CustomError(
            "user-modification-denied",
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
      }

      if (params.useCase === "RESET_PASSWORD") {
        const currentUserPassword = user.password;

        if (user.authenticatedAs !== "LOCAL" || !currentUserPassword) {
          throw new CustomError(
            "user-modification-denied",
            `User can not reset password due to authenticating as ${user.authenticatedAs}`
          );
        }

        if (!params.newPassword)
          throw new CustomError("missing-inputs", "Missing newPassword in request body.");

        const samePassword = await bcrypt.compare(params.newPassword, currentUserPassword);

        if (samePassword) throw new CustomError("user-enters-same-password");

        await this.db.users.update({
          where: {
            userId: params.userId,
          },
          data: {
            password: await bcrypt.hash(params.newPassword, 10),
          },
        });
      }

      if (params.useCase === "VERIFY_EMAIL") {
        if (!params.email)
          throw new CustomError("missing-inputs", "Missing email in request body.");

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

  async delete(userId: string, password?: string): Promise<string[]> {
    try {
      const user = await this.db.users.findFirst({
        where: {
          userId,
        },
        include: {
          profile: true,
          blogs: {
            select: {
              contents: {
                select: {
                  contentImage: true,
                },
              },
              coverImage: true,
            },
          },
        },
      });

      if (!user) throw new CustomError("does-not-exist", "User does not exist.");

      if (user.authenticatedAs === "LOCAL" && user.password) {
        if (!password)
          throw new CustomError(
            "does-not-exist",
            "Your password does not exist, this is unexpected. Please report it to the devs!"
          );

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) throw new CustomError("wrong-credentials", "Entered the wrong password!");
      }

      const images: string[] = [];

      if (user.profile?.profileCover) images.push(user.profile.profileCover);
      if (user.profile?.profilePicture) images.push(user.profile.profilePicture);

      user.blogs.forEach((val) => {
        if (val.coverImage) images.push(val.coverImage);

        val.contents.forEach((cont) => {
          if (cont.contentImage) images.push(cont.contentImage);
        });
      });

      await this.db.$transaction([
        this.db.userConnections.deleteMany({
          where: {
            OR: [{ sourceUserId: userId }, { targetUserId: userId }],
          },
        }),

        this.db.users.delete({
          where: {
            userId: userId,
          },
        }),
      ]);

      return images;
    } catch (err) {
      if (err instanceof CustomError) throw err;

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
