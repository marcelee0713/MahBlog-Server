import { LogType, UserLogData } from "../../types/user/user.logs.types";

export interface IUserLogs {
  logId: string;
  content: string;
  type: LogType;
  createdAt: Date;

  getLogId: () => string;
  getContent: () => string;
  getType: () => LogType;
  getCreatedAt: () => Date;
  setLogId: (logId: string) => void;
  setContent: (content: string) => void;
  setType: (type: LogType) => void;
  setCreatedAt: (date: Date) => void;

  canUpdate: (createdAt: Date) => boolean;
  getDefaultContent: (type: LogType) => string;
}

export interface IUserLogsService {
  addLog: (userId: string, type: LogType) => Promise<void>;
  updateable: (userId: string, type: LogType) => Promise<boolean>;
}

export interface IUserLogsRepository {
  add: (userId: string, type: LogType, content: string) => Promise<void>;
  get: (userId: string, type: LogType) => Promise<UserLogData | null>;
}

// TODOS:
// - Create a router and controller for this
// - Routes would check if the name and email is updateable
