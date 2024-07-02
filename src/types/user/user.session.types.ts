import { ExcludeFunctions } from "..";
import {
  EmailChangePayload,
  EmailVerifyPayload,
  PassResetPayload,
  UserSessionPayload,
} from "../../interfaces/auth.interface";
import { IUserSession } from "../../interfaces/user/user.session.interface";

export type UserSessionData = ExcludeFunctions<IUserSession>;

export type SessionType = "ACCESS" | "REFRESH" | "EMAIL_VERIFY" | "EMAIL_CHANGE" | "PASS_RESET";

export type PayloadType<T extends SessionType> = PayloadMapping[T];

type PayloadMapping = {
  ACCESS: UserSessionPayload;
  REFRESH: UserSessionPayload;
  EMAIL_VERIFY: EmailVerifyPayload;
  EMAIL_CHANGE: EmailChangePayload;
  PASS_RESET: PassResetPayload;
};
