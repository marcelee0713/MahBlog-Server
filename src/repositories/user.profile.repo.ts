import { injectable } from "inversify";
import { IUserProfileRepository } from "../interfaces/user/user.profile.interface";
import {
  UserProfileData,
  DeleteUserProfileUseCase,
  UpdateUserProfileUseCase,
  UpdateUserProfileParamsType,
} from "../types/user/user.profile.types";
import { Prisma, PrismaClient } from "@prisma/client";
import { db } from "../config/db";
import { CustomError } from "../utils/error_handler";

@injectable()
export class UserProfileRepository implements IUserProfileRepository {
  private db: PrismaClient;

  constructor() {
    this.db = db;
  }

  async get(userId: string): Promise<UserProfileData> {
    try {
      const data = await this.db.userProfile.findFirst({
        where: {
          userId: userId,
        },
      });

      if (!data) throw new CustomError("does-not-exist", "User does not exist.");

      return {
        ...data,
      };
    } catch (err) {
      throw new CustomError(
        "internal-server-error",
        "An internal server error occured when getting the user's profile data.",
        500,
        "UserProfileRepository",
        `By getting a user profile data.`
      );
    }
  }

  async delete(userId: string, type: DeleteUserProfileUseCase): Promise<void> {
    try {
      if (type === "BIO") {
        await this.db.userProfile.update({
          where: {
            userId: userId,
          },
          data: {
            bio: null,
          },
        });

        return;
      }

      if (type === "PROFILE_IMAGE") {
        await this.db.userProfile.update({
          where: {
            userId: userId,
          },
          data: {
            profilePicture: null,
          },
        });

        return;
      }

      if (type === "COVER_IMAGE") {
        await this.db.userProfile.update({
          where: {
            userId: userId,
          },
          data: {
            profileCover: null,
          },
        });
      }
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2025") {
          throw new CustomError("does-not-exist", "User does not exist.");
        }
      }

      throw new CustomError(
        "internal-server-error",
        "An internal server error occured when updating the user's profile data.",
        500,
        "UserProfileRepository",
        `By updating a user profile data by using the use case: ${type}`
      );
    }
  }

  async update<T extends UpdateUserProfileUseCase>(
    params: UpdateUserProfileParamsType<T>,
    type: UpdateUserProfileUseCase
  ): Promise<void> {
    try {
      switch (type) {
        case "BIO": {
          await this.db.userProfile.update({
            where: {
              userId: params.userId,
            },
            data: {
              ...params,
            },
          });

          break;
        }
        case "NAME": {
          const data = params as UpdateUserProfileParamsType<"NAME">;

          await this.db.userProfile.update({
            where: {
              userId: params.userId,
            },
            data: {
              firstName: data.fName,
              middleName: data.mName ?? null,
              lastName: data.lName,
            },
          });

          break;
        }
        case "COVER_IMAGE": {
          const data = params as UpdateUserProfileParamsType<"COVER_IMAGE">;

          await this.db.userProfile.update({
            where: {
              userId: params.userId,
            },
            data: {
              profileCover: data.imageUrl,
            },
          });

          break;
        }

        case "PROFILE_IMAGE": {
          const data = params as UpdateUserProfileParamsType<"PROFILE_IMAGE">;

          await this.db.userProfile.update({
            where: {
              userId: params.userId,
            },
            data: {
              profilePicture: data.imageUrl,
            },
          });

          break;
        }
      }
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2025") {
          throw new CustomError("does-not-exist", "User does not exist.");
        }
      }

      throw new CustomError(
        "internal-server-error",
        "An internal server error occured when updating the user's profile data.",
        500,
        "UserProfileRepository",
        `By updating a user profile data by using the use case: ${type}`
      );
    }
  }
}
