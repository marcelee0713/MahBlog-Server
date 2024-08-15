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
          const targetUsers: UserConnections[] = [];

          const param = params as GetConnectionsParamsType<"GET_CONNECTIONS">;

          const data = await this.db.userConnections.findMany({
            where: {
              OR: [
                {
                  sourceUserId: param.userId,
                },
                {
                  targetUserId: param.userId,
                },
              ],
              AND: [
                {
                  status: "ACCEPTED",
                },
              ],
            },
            orderBy: {
              createdAt: "desc",
            },
          });

          for (let i = 0; i < data.length; i++) {
            const targetUser = await this.db.userProfile.findFirst({
              where: {
                userId: data[i].targetUserId,
              },
              select: {
                userId: true,
                firstName: true,
                middleName: true,
                lastName: true,
                profilePicture: true,
              },
            });

            if (targetUser) {
              const name = `${targetUser.firstName} ${targetUser.middleName ? targetUser.middleName + " " : ""}${targetUser.lastName}`;

              const nameLowCaseVer = name.toLowerCase();

              const searchingCondition =
                param.searchNameInput &&
                nameLowCaseVer.startsWith(param.searchNameInput.toLowerCase());

              if (searchingCondition) {
                targetUsers.push({
                  connectionId: data[i].connectionId,
                  userId: targetUser.userId,
                  name: name,
                  profilePicture: targetUser.profilePicture,
                });
              } else {
                targetUsers.push({
                  connectionId: data[i].connectionId,
                  userId: targetUser.userId,
                  name: name,
                  profilePicture: targetUser.profilePicture,
                });
              }
            }
          }

          const res = targetUsers as GetConnectionReturnType<T>;

          return res;
        }

        case "GET_PENDING_CONNECTIONS": {
          const pendingConnectors: UserPendingConnections[] = [];

          const param = params as GetConnectionsParamsType<"GET_PENDING_CONNECTIONS">;

          const data = await this.db.userConnections.findMany({
            where: {
              targetUserId: param.userId,
              status: "PENDING",
            },
            orderBy: {
              createdAt: param.dateOrder,
            },
          });

          for (let i = 0; i < data.length; i++) {
            const targetUser = await this.db.userProfile.findFirst({
              where: {
                userId: data[i].sourceUserId,
              },
              select: {
                userId: true,
                firstName: true,
                middleName: true,
                lastName: true,
                profilePicture: true,
              },
            });

            if (targetUser) {
              const name = `${targetUser.firstName} ${targetUser.middleName ?? ""} ${targetUser.lastName}`;

              pendingConnectors.push({
                connectionId: data[i].connectionId,
                userId: targetUser.userId,
                name: name,
                profilePicture: targetUser.profilePicture,
                createdAt: data[i].createdAt,
              });
            }
          }

          return pendingConnectors as GetConnectionReturnType<T>;
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

          // TODO SOON: When it goes back in its controller, make sure to also send a UserNotification to the sourceUserId
          // To say that you've accepted its connection request

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

          // TODO SOON: When it goes back in its controller, make sure to also send a UserNotification to the sourceUserId
          // To say that you've rejects its connection request

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
            `Looks like this connection request does not exist no longer exist.`,
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
