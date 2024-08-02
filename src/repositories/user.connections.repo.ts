import { injectable } from "inversify";
import { IUserConnectionRepository } from "../interfaces/user/user.connections.interface";
import {
  GetConnectionsUseCase,
  GetConnectionsParamsType,
  GetConnectionReturnType,
  ConnectionStatus,
} from "../types/user/user.connections.types";
import { PrismaClient } from "@prisma/client";
import { db } from "../config/db";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { CustomError } from "../utils/error_handler";

@injectable()
export class UserConnectionsRepository implements IUserConnectionRepository {
  private db: PrismaClient;

  constructor() {
    this.db = db;
  }

  async create(sourceId: string, targetUserId: string): Promise<void> {
    try {
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
              sourceUserId: param.userId,
            },
          });

          const res = {
            userId: param.userId,
            count: count,
          } as GetConnectionReturnType<T>;

          return res;
        }

        case "GET_CONNECTIONS": {
          const targetUsers = [] as GetConnectionReturnType<"GET_CONNECTIONS">;

          const param = params as GetConnectionsParamsType<"GET_CONNECTIONS">;

          const data = await this.db.userConnections.findMany({
            where: {
              status: "ACCEPTED",
              OR: [
                {
                  sourceUserId: param.userId,
                },
                {
                  targetUserId: param.userId,
                },
              ],
            },
            orderBy: {
              createdAt: "desc",
            },
          });

          data.forEach(async (val) => {
            const targetUser = await this.db.userProfile.findFirst({
              where: {
                userId: val.targetUserId,
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

              const nameLowCaseVer = name.toLowerCase();

              const searchingCondition =
                param.searchNameInput &&
                nameLowCaseVer.startsWith(param.searchNameInput.toLowerCase());

              if (searchingCondition) {
                targetUsers.push({
                  userId: targetUser.userId,
                  name: name,
                  profilePicture: targetUser.profilePicture,
                });
              } else {
                targetUsers.push({
                  userId: targetUser.userId,

                  name: name,
                  profilePicture: targetUser.profilePicture,
                });
              }
            }
          });

          const res = targetUsers as GetConnectionReturnType<T>;

          return res;
        }

        case "GET_PENDING_CONNECTIONS": {
          const pendingConnectors = [] as GetConnectionReturnType<"GET_PENDING_CONNECTIONS">;

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

          data.forEach(async (val) => {
            const targetUser = await this.db.userProfile.findFirst({
              where: {
                userId: val.sourceUserId,
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
                userId: targetUser.userId,
                name: name,
                profilePicture: targetUser.profilePicture,
                createdAt: val.createdAt,
              });
            }
          });

          const res = pendingConnectors as GetConnectionReturnType<T>;

          return res;
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

  async update(
    connectionId: string,
    sourceUserId: string,
    targetUserId: string,
    status: ConnectionStatus
  ): Promise<void> {
    try {
      switch (status) {
        case "ACCEPTED": {
          await db.userConnections.update({
            data: {
              updatedAt: new Date(),
              status: status,
            },
            where: {
              connectionId,
              sourceUserId,
              targetUserId,
            },
          });

          // TODO SOON: When it goes back in its controller, make sure to also send a UserNotification to the sourceUserId
          // To say that you've accepted its connection request

          break;
        }

        case "REJECTED": {
          await db.userConnections.delete({
            where: {
              connectionId,
              sourceUserId,
              targetUserId,
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
              status: status,
            },
            where: {
              connectionId,
              sourceUserId,
              targetUserId,
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
