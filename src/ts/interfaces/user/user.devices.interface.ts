export interface IUserDevices {
  isUserDeviceExpired(createdAt: Date): boolean;
  isDeviceVerificationExpired(createdAt: Date): boolean;
  generateRandomSixDigitCode(): string;
}

export interface IUserDevicesService {
  addDeviceId(userId: string, deviceId: string): Promise<void>;

  deviceExist(userId: string, deviceId: string): Promise<boolean>;

  verifyDeviceId(
    userId: string,
    enteredCode: string,
    expectedDeviceId: string,
    deviceVerificationId: string
  ): Promise<void>;

  /**
   * It will only return a six digit code when there is no existing request is on-going to that device-id
   *
   * The six digit code will be created in the email.
   *
   * If it returns a null, it will not create a new code and email because the current request is on going
   *
   * Because of that we need to redirect the user and tell the user to view the its email.
   */
  createDeviceVerification(
    userId: string,
    unknownDeviceId: string
  ): Promise<CreateDeviceData | null>;

  removeExpiredDevicesId(): Promise<void>;

  removeExpiredDeviceVerifications(): Promise<void>;
}

export interface IUserDevicesRepository {
  get(userId: string, deviceId: string): Promise<UserDevicesData | null>;
  getAll(): Promise<UserDevicesData[]>;
  create(userId: string, deviceId: string): Promise<void>;
  update(userId: string, deviceId: string, signedInAt: Date): Promise<void>;
  delete(userId: string, deviceId: string): Promise<void>;
  deleteAll(devicesId: string[]): Promise<void>;
}

export interface IDeviceVerificationsRepository {
  get(deviceId: string): Promise<DeviceVerificationData | null>;
  getAll(): Promise<DeviceVerificationData[]>;
  create(code: string, expectedDeviceId: string): Promise<DeviceVerificationData>;
  update(deviceVerificationId: string, verifiedAt: Date): Promise<void>;
  deleteMany(deviceVerificationId: string[]): Promise<void>;
  delete(deviceVerificationId: string): Promise<void>;
}

export interface CreateDeviceData {
  email: string;
  code: string;
  deviceVerificationId: string;
}

export interface UserDevicesData {
  deviceId: string;
  userId: string;
  createdAt: Date;
  lastSignedIn: Date | null;
}

export interface DeviceVerificationData {
  deviceVerificationId: string;
  expectedDeviceId: string;
  code: string;
  verifiedAt: Date | null;
  createdAt: Date;
}
