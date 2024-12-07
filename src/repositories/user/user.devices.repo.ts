import { injectable } from "inversify";
import {
  IUserDevicesRepository,
  UserDevicesData,
} from "../../ts/interfaces/user/user.devices.interface";
import { CustomError } from "../../utils/error_handler";
import { Prisma, PrismaClient } from "@prisma/client";
import { db } from "../../config/db";

@injectable()
export class UserDevicesRepository implements IUserDevicesRepository {
  private db: PrismaClient;

  constructor() {
    this.db = db;
  }

  async get(userId: string, deviceId: string): Promise<UserDevicesData | null> {
    try {
      const data = await this.db.userDevices.findFirst({ where: { userId, deviceId } });

      return data;
    } catch (err) {
      throw new CustomError(
        "internal-server-error",
        "An internal server error occured when getting user devices.",
        500,
        "UserDevicesRepository",
        `By getting a user's device.`
      );
    }
  }

  async getAll(): Promise<UserDevicesData[]> {
    try {
      const data = await this.db.userDevices.findMany();

      return data;
    } catch (err) {
      throw new CustomError(
        "internal-server-error",
        "An internal server error occured when getting all user devices.",
        500,
        "UserDevicesRepository",
        `By getting user's devices.`
      );
    }
  }

  async create(userId: string, deviceId: string): Promise<void> {
    try {
      const data = await this.get(userId, deviceId);

      if (data) return;

      await this.db.userDevices.create({
        data: {
          deviceId: deviceId,
          users: {
            connect: {
              userId: userId,
            },
          },
        },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2025") {
          throw new CustomError("does-not-exist", "User does not exist.", 404);
        }
      }

      throw new CustomError(
        "internal-server-error",
        "An internal server error occured when create a user device",
        500,
        "UserDevicesRepository",
        `By creating user device.`
      );
    }
  }

  async update(userId: string, deviceId: string, signedInAt: Date): Promise<void> {
    try {
      await this.db.userDevices.update({
        where: {
          userId_deviceId: {
            deviceId,
            userId,
          },
        },
        data: {
          lastSignedIn: signedInAt,
        },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2025") {
          throw new CustomError("does-not-exist", "User devices does not exist.", 404);
        }
      }

      throw new CustomError(
        "internal-server-error",
        "An internal server error occured when updating a user device",
        500,
        "UserDevicesRepository",
        `By updating a user device.`
      );
    }
  }

  async delete(userId: string, deviceId: string): Promise<void> {
    try {
      await this.db.userDevices.delete({
        where: {
          userId_deviceId: {
            deviceId,
            userId,
          },
        },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2025") {
          throw new CustomError("does-not-exist", "User devices does not exist.", 404);
        }
      }

      throw new CustomError(
        "internal-server-error",
        "An internal server error occured when deleting a user device",
        500,
        "UserDevicesRepository",
        `By deleting a user device.`
      );
    }
  }

  async deleteAll(devicesId: string[]): Promise<void> {
    try {
      await this.db.userDevices.deleteMany({
        where: {
          deviceId: {
            in: devicesId,
          },
        },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2025") {
          throw new CustomError("does-not-exist", "User devices does not exist.", 404);
        }
      }

      throw new CustomError(
        "internal-server-error",
        "An internal server error occured when deleting all user device",
        500,
        "UserDevicesRepository",
        `By deleting all a user device.`
      );
    }
  }
}
