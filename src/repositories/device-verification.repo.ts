import { injectable } from "inversify";
import {
  DeviceVerificationData,
  IDeviceVerificationsRepository,
} from "../ts/interfaces/user/user.devices.interface";
import { CustomError } from "../utils/error_handler";
import { Prisma, PrismaClient } from "@prisma/client";
import { db } from "../config/db";
import bcrypt from "bcryptjs";

@injectable()
export class DeviceVerificationsRepository implements IDeviceVerificationsRepository {
  private db: PrismaClient;

  constructor() {
    this.db = db;
  }

  async get(deviceId: string): Promise<DeviceVerificationData | null> {
    try {
      const data = await this.db.deviceVerifications.findFirst({
        where: {
          expectedDeviceId: deviceId,
        },
      });

      return data;
    } catch (err) {
      throw new CustomError(
        "internal-server-error",
        "An internal server error occured when getting a device verification.",
        500,
        "DevicesVerificationRepository",
        `By getting a device verification.`
      );
    }
  }

  async getAll(): Promise<DeviceVerificationData[]> {
    try {
      const data = await this.db.deviceVerifications.findMany();

      return data;
    } catch (err) {
      throw new CustomError(
        "internal-server-error",
        "An internal server error occured when getting all device verification.",
        500,
        "DevicesVerificationRepository",
        `By getting all device verification.`
      );
    }
  }

  async create(code: string, expectedDeviceId: string): Promise<DeviceVerificationData> {
    try {
      const data = await this.db.deviceVerifications.create({
        data: {
          code: await bcrypt.hash(code, 10),
          expectedDeviceId,
        },
      });

      return data;
    } catch (err) {
      throw new CustomError(
        "internal-server-error",
        "An internal server error occured when creating a device verification.",
        500,
        "DevicesVerificationRepository",
        `By creating a device verification.`
      );
    }
  }

  async update(deviceVerificationId: string, verifiedAt?: Date, token?: string): Promise<void> {
    try {
      await this.db.deviceVerifications.update({
        where: {
          deviceVerificationId,
        },
        data: {
          verifiedAt: verifiedAt,
          token: token,
        },
      });
    } catch (err) {
      throw new CustomError(
        "internal-server-error",
        "An internal server error occured when creating a device verification.",
        500,
        "DevicesVerificationRepository",
        `By updating a device verification.`
      );
    }
  }

  async delete(deviceVerificationId: string): Promise<void> {
    try {
      await this.db.deviceVerifications.delete({
        where: {
          deviceVerificationId,
        },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2025") {
          throw new CustomError("does-not-exist", "User device verification does not exist.", 404);
        }
      }

      throw new CustomError(
        "internal-server-error",
        "An internal server error occured when deleting a device verification.",
        500,
        "DevicesVerificationRepository",
        `By deleting a device verification.`
      );
    }
  }

  async deleteMany(deviceVerificationId: string[]): Promise<void> {
    try {
      await this.db.deviceVerifications.deleteMany({
        where: {
          deviceVerificationId: {
            in: deviceVerificationId,
          },
        },
      });
    } catch (err) {
      throw new CustomError(
        "internal-server-error",
        "An internal server error occured when deleting selected device verifications.",
        500,
        "DevicesVerificationRepository",
        `By deleting selected device verifications.`
      );
    }
  }
}
