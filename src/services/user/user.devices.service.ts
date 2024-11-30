import { inject, injectable } from "inversify";
import {
  CreateDeviceData,
  IDeviceVerificationsRepository,
  IUserDevices,
  IUserDevicesRepository,
  IUserDevicesService,
} from "../../ts/interfaces/user/user.devices.interface";
import { TYPES } from "../../constants";
import { CustomError } from "../../utils/error_handler";
import bcrypt from "bcryptjs";
import { IUserRepository } from "../../ts/interfaces/user/user.interface";

@injectable()
export class UserDevicesService implements IUserDevicesService {
  private entity: IUserDevices;
  private repo: IUserDevicesRepository;
  private verifRepo: IDeviceVerificationsRepository;
  private userRepo: IUserRepository;

  constructor(
    @inject(TYPES.UserRepository) userRepo: IUserRepository,
    @inject(TYPES.UserDevicesModel) entity: IUserDevices,
    @inject(TYPES.UserDevicesRepository) repo: IUserDevicesRepository,
    @inject(TYPES.DeviceVerificationsRepository) verifRepo: IDeviceVerificationsRepository
  ) {
    this.userRepo = userRepo;
    this.entity = entity;
    this.repo = repo;
    this.verifRepo = verifRepo;
  }

  async addDeviceId(userId: string, deviceId: string): Promise<void> {
    return await this.repo.create(userId, deviceId);
  }

  async deviceExist(userId: string, deviceId: string): Promise<boolean> {
    return (await this.repo.get(userId, deviceId)) !== null;
  }

  async verifyDeviceId(
    userId: string,
    enteredCode: string,
    expectedDeviceId: string,
    deviceVerificationId: string
  ): Promise<void> {
    const data = await this.verifRepo.get(deviceVerificationId);

    if (!data) throw new CustomError("does-not-exist", "Device Verification does not exist");

    if (expectedDeviceId !== data.expectedDeviceId)
      throw new CustomError("invalid", "This device is not what we expected");

    if (!(await bcrypt.compare(enteredCode, data.code)))
      throw new CustomError("invalid", "Code is incorrect");

    await this.verifRepo.update(deviceVerificationId, new Date());

    return await this.repo.create(userId, expectedDeviceId);
  }

  async createDeviceVerification(
    userId: string,
    unknownDeviceId: string
  ): Promise<CreateDeviceData | string> {
    const data = await this.verifRepo.get(unknownDeviceId);

    if (data && data.expectedDeviceId === unknownDeviceId) {
      if (!this.entity.isDeviceVerificationExpired(data.createdAt) && data.token != null)
        return data.token;
    }

    const code = this.entity.generateRandomSixDigitCode();

    const { deviceVerificationId } = await this.verifRepo.create(code, unknownDeviceId);

    const { email } = await this.userRepo.get({ userId }, "USER_ID");

    return {
      code,
      deviceVerificationId,
      email,
    };
  }

  async updateVerificationWithToken(deviceVerificationId: string, token: string): Promise<void> {
    return await this.verifRepo.update(deviceVerificationId, undefined, token);
  }

  async removeExpiredDevicesId(): Promise<void> {
    const devices = await this.repo.getAll();

    /**
     * Key is the userId
     * the value is the expired devices by putting their id
     */
    const userDevicesMap = new Map<string, string[]>();

    for (let i = 0; i < devices.length; i++) {
      const device = devices[i];

      if (this.entity.isUserDeviceExpired(device.createdAt)) {
        const currentExpiredDevices = userDevicesMap.get(device.userId);

        const newArray = currentExpiredDevices ?? [];

        newArray.push(device.deviceId);

        userDevicesMap.set(device.userId, newArray);
      }
    }

    const allExpiredDevices = Array.from(userDevicesMap.values()).flat();

    return await this.repo.deleteAll(allExpiredDevices);
  }

  async removeExpiredDeviceVerifications(): Promise<void> {
    const verifications = await this.verifRepo.getAll();

    const expiredVerifications: string[] = [];

    for (let i = 0; i < verifications.length; i++) {
      const verif = verifications[i];

      if (this.entity.isDeviceVerificationExpired(verif.createdAt)) {
        expiredVerifications.push(verif.deviceVerificationId);
      }
    }

    return await this.verifRepo.deleteMany(expiredVerifications);
  }
}
