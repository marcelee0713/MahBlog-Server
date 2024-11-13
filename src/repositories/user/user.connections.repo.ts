import { injectable } from "inversify";
import {
  IUserConnectionRepository,
  UserConnections,
  UserPendingConnections,
  UserUpdateConnectionParams,
} from "../../interfaces/user/user.connections.interface";
import {
  GetConnectionsUseCase,
  GetConnectionsParamsType,
  GetConnectionReturnType,
} from "../../types/user/user.connections.types";
import { PrismaClient } from "@prisma/client";
import { db } from "../../config/db";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { CustomError } from "../../utils/error_handler";

@injectable()
export class UserConnectionsRepository implements IUserConnectionRepository {
  private db: PrismaClient;

  constructor() {
    this.db = db;
  }

  async create(sourceId: string, targetUserId: string): Promise<void> {
    try {
      const data = await this.db.userConnections.findFirst({
        where: {
          sourceUserId: sourceId,
          targetUserId: targetUserId,
        },
      });

      if (data) {
        throw new CustomError("already-exist", "This user connection already exist.");
      }

      await this.db.userConnections.create({
        data: {
          sourceUser: {
            connect: {
              userId: sourceId,
            },
          },
          targetUser: {
            connect: {
              userId: targetUserId,
            },
          },
        },
      });
    } catch (err) {
      if (err instanceof CustomError) throw err;

      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === "P2025")
          throw new CustomError(
            "does-not-exist",
            "The user who's trying to connect may no longer exist.",
            404,
            "UserConnectionsRepository",
            "The target user does not exist."
          );
      }

      throw new CustomError(
        "internal-server-error",
        "An internal server error occured when creating a user connection.",
        500,
        "UserConnectionRepository",
        "By creating a UserConnection."
      );
    }
  }

  async get<T extends GetConnectionsUseCase>(
    params: GetConnectionsParamsType<T>,
    type: T
  ): Promise<GetConnectionReturnType<T>> {
    try {
      switch (type) {
        case "GET_COUNT": {
          const param = params as GetConnectionsParamsType<"GET_COUNT">;

          const count = await this.db.userConnections.count({
            where: {
              OR: [
                {
                  sourceUserId: param.userId,
                },
                {
                  targetUserId: param.userId,
                },
              ],
            },
          });

          const res = {
            userId: param.userId,
            count: count,
          } as GetConnectionReturnType<T>;

          return res;
        }

        case "GET_CONNECTIONS": {
          const connections: UserConnections[] = [];

          const param = params as GetConnectionsParamsType<"GET_CONNECTIONS">;

          const { userId, dateOrder, pagination, searchNameInput } = param;

          const data = await this.db.userConnections.findMany({
            skip: pagination.skip,
            take: pagination.take,
            where: {
              OR: [
                {
                  sourceUserId: userId,
                  sourceUser: searchNameInput
                    ? {
                        profile: {
                          firstName: {
                            startsWith: searchNameInput,
                            mode: "insensitive",
                          },
                        },
                      }
                    : undefined,
                },
                {
                  targetUserId: userId,
                  targetUser: searchNameInput
                    ? {
                        profile: {
                          firstName: {
                            startsWith: searchNameInput,
                            mode: "insensitive",
                          },
                        },
                      }
                    : undefined,
                },
              ],
              AND: [
                {
                  status: "ACCEPTED",
                },
              ],
            },
            orderBy: {
              createdAt: dateOrder,
            },
            include: {
              sourceUser: {
                select: {
                  profile: true,
                },
              },
              targetUser: {
                select: {
                  profile: true,
                },
              },
            },
          });

          for (let i = 0; i < data.length; i++) {
            const val = data[i];

            let profile = null;

            if (val.sourceUserId !== userId && val.targetUserId === userId) {
              profile = val.sourceUser.profile;
            } else {
              profile = val.targetUser.profile;
            }

            if (!profile) continue;

            const name = [profile.firstName, profile.middleName, profile.lastName]
              .filter(Boolean)
              .join(" ");

            const obj: UserConnections = {
              connectionId: val.connectionId,
              name,
              profilePicture: profile.profilePicture,
              userId: profile.userId,
            };

            connections.push(obj);
          }

          const res = connections as GetConnectionReturnType<T>;

          return res;
        }

        case "GET_PENDING_CONNECTIONS": {
          const pendingConnections: UserPendingConnections[] = [];

          const param = params as GetConnectionsParamsType<"GET_PENDING_CONNECTIONS">;

          const { dateOrder, pagination, userId } = param;

          const data = await this.db.userConnections.findMany({
            skip: pagination.skip,
            take: pagination.take,
            where: {
              targetUserId: userId,
              status: "PENDING",
            },
            orderBy: {
              createdAt: dateOrder,
            },
            include: {
              targetUser: {
                select: {
                  profile: true,
                },
              },
            },
          });

          for (let i = 0; i < data.length; i++) {
            const val = data[i];

            const profile = val.targetUser.profile;

            if (!profile) continue;

            const name = [profile.firstName, profile.middleName, profile.lastName]
              .filter(Boolean)
              .join(" ");

            const obj: UserPendingConnections = {
              connectionId: val.connectionId,
              name,
              profilePicture: profile.profilePicture,
              userId: profile.userId,
              createdAt: val.createdAt,
            };

            pendingConnections.push(obj);
          }

          return pendingConnections as GetConnectionReturnType<T>;
        }

        default:
          throw new CustomError("does-not-exist", "This use case currently does not exist.");
      }
    } catch (err) {
      throw new CustomError(
        "internal-server-error",
        "An internal server error occured when getting a user connection data.",
        500,
        "UserConnectionRepository",
        "By getting a UserConnection data."
      );
    }
  }

  async update(params: UserUpdateConnectionParams): Promise<void> {
    try {
      switch (params.status) {
        case "ACCEPTED": {
          await db.userConnections.update({
            data: {
              updatedAt: new Date(),
              status: params.status,
            },
            where: {
              connectionId: params.connectionId,
              sourceUserId: params.sourceUserId,
              targetUserId: params.targetUserId,
            },
          });

          break;
        }

        case "REJECTED": {
          await db.userConnections.delete({
            where: {
              connectionId: params.connectionId,
              sourceUserId: params.sourceUserId,
              targetUserId: params.targetUserId,
            },
          });

          break;
        }

        case "BLOCKED": {
          await db.userConnections.update({
            data: {
              updatedAt: new Date(),
              status: params.status,
            },
            where: {
              connectionId: params.connectionId,
              sourceUserId: params.sourceUserId,
              targetUserId: params.targetUserId,
            },
          });
        }
      }
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === "P2025")
          throw new CustomError(
            "does-not-exist",
            "This connection request does not exist",
            404,
            "UserConnectionsRepository",
            "The user who created the connection request may no longer exist."
          );
      }

      throw new CustomError(
        "internal-server-error",
        "An internal server error occured when creating a user connection.",
        500,
        "UserConnectionRepository",
        "By creating a UserConnection."
      );
    }
  }
}
