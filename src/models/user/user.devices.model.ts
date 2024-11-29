import { injectable } from "inversify";
import { IUserDevices } from "../../ts/interfaces/user/user.devices.interface";

@injectable()
export class UserDevices implements IUserDevices {
  isUserDeviceExpired(createdAt: Date): boolean {
    const oneYearInMilliseconds = 365 * 24 * 60 * 60 * 1000;
    const currentTime = new Date().getTime();
    return currentTime - createdAt.getTime() > oneYearInMilliseconds;
  }

  isDeviceVerificationExpired(createdAt: Date): boolean {
    const tenMinutesInMilliseconds = 10 * 60 * 1000;
    const currentTime = new Date().getTime();
    return currentTime - createdAt.getTime() > tenMinutesInMilliseconds;
  }

  generateRandomSixDigitCode(): string {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";

    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters[randomIndex];
    }

    return code;
  }
}
