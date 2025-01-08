import { ExcludeFunctions } from "..";
import {
  DeviceVerifyPayload,
  EmailChangePayload,
  EmailVerifyPayload,
  ResetPassPayload,
  UserDeletionVerifyPayload,
  UserSessionPayload,
} from "../../interfaces/auth.interface";
import { IUserSession } from "../../interfaces/user/user.session.interface";

export type UserSessionData = ExcludeFunctions<IUserSession>;

export type SessionType =
  | "ACCESS"
  | "REFRESH"
  | "EMAIL_VERIFY"
  | "EMAIL_CHANGE"
  | "RESET_PASS"
  | "DEVICE_VERIFY"
  | "USER_DELETION_VERIFY";

export type PayloadType<T extends SessionType> = PayloadMapping[T];

type PayloadMapping = {
  ACCESS: UserSessionPayload;
  REFRESH: UserSessionPayload;
  EMAIL_VERIFY: EmailVerifyPayload;
  EMAIL_CHANGE: EmailChangePayload;
  RESET_PASS: ResetPassPayload;
  DEVICE_VERIFY: DeviceVerifyPayload;
  USER_DELETION_VERIFY: UserDeletionVerifyPayload;
};
