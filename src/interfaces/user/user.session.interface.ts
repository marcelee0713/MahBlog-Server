import { UserSessionData } from "../../types/user/user.session.types";

export interface IUserSession {
  sessionId: string;
  userId: string;
  refreshToken: string;
  createdAt: Date;
  expiresAt: Date;
  getSession: () => UserSessionData;
  getSessionId: () => string;
  getUserId: () => string;
  getRefreshToken: () => string;
  getCreatedAt: () => Date;
  getExpiresAt: () => Date;
  setSession: (data: UserSessionData) => void;
  setSessionId: (sessionId: string) => void;
  setUserId: (userId: string) => void;
  setRefreshToken: (refreshToken: string) => void;
  setCreatedAt: (date: Date) => void;
  setExpiresAt: (date: Date) => void;
  isSessionExpired: (date: Date) => boolean;
  convertNumberToDate: (time?: number) => Date;
}

export interface IUserSessionService {
  createSession: (userId: string) => Promise<string>;
  deleteSession: (userId: string, sessionId: string) => Promise<void>;
}

export interface IUserSessionRepository {
  create: (params: UserSessionData) => Promise<void>;
  delete: (userId: string, sessionId: string) => Promise<void>;
}
