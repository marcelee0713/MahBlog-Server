import { injectable } from "inversify";
import { IUserProfileRepository } from "../interfaces/user/user.profile.interface";
import {
  UserProfileData,
  UserProfileRemoveUseCase,
  UserProfileUpdateUseCase,
  UserProfileUpdateType,
} from "../types/user/user.profile.types";
import { PrismaClient } from "@prisma/client";
import { db } from "../config/db";
import { ErrorType } from "../types";

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

      if (!data) throw new Error("user-does-not-exist" as ErrorType);

      return {
        ...data,
        bio: data.middleName ?? undefined,
        middleName: data.middleName ?? undefined,
        profilePicture: data.profilePicture ?? undefined,
        profileCover: data.profileCover ?? undefined,
      };
    } catch (err) {
      throw new Error("internal-server-error" as ErrorType);
    }
  }

  async delete(userId: string, type: UserProfileRemoveUseCase): Promise<void> {
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
      throw new Error("internal-server-error" as ErrorType);
    }
  }

  async update<T extends UserProfileUpdateUseCase>(
    params: UserProfileUpdateType<T>,
    type: UserProfileUpdateUseCase
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
          const data = params as UserProfileUpdateType<"NAME">;

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
          const data = params as UserProfileUpdateType<"COVER_IMAGE">;

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
          const data = params as UserProfileUpdateType<"PROFILE_IMAGE">;

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
      throw new Error("internal-server-error" as ErrorType);
    }
  }
}
