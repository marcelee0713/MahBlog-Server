import { PayloadType, SessionType } from "../types/user/user.session.types";

export interface IAuthService {
  createToken<T extends SessionType>(payload: PayloadType<T>, type: T): string;
  verifyToken<T extends SessionType>(token: string, type: T): boolean;
  decodeToken<T extends SessionType>(token: string, type: T): PayloadType<T>;
}

export interface AuthServicePayload {
  iat?: number;
  exp?: number;
}

export interface UserSessionPayload extends AuthServicePayload {
  userId: string;
  sessionId: string;
}

export interface EmailVerifyPayload extends AuthServicePayload {
  userId: string;
  email: string;
}

export interface EmailChangePayload extends AuthServicePayload {
  userId: string;
  oldEmail: string;
  newEmail: string;
}

export interface ResetPassPayload extends AuthServicePayload {
  userId: string;
}

export interface DeviceVerifyPayload extends AuthServicePayload {
  userId: string;
  deviceVerificationId: string;
}
