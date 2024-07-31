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
  getLog: (userId: string, type?: LogType) => Promise<UserLogData>;
  getLogs: (userId: string, type?: LogType) => Promise<UserLogData[]>;
  deleteLog: (userId: string, logId: string) => Promise<void>;
  deleteLogs: (userId: string) => Promise<void>;
}

export interface IUserLogsRepository {
  create: (userId: string, type: LogType, content: string) => Promise<void>;
  get: (userId: string, type?: LogType) => Promise<UserLogData | null>;
  getAll: (userId: string, type?: LogType) => Promise<UserLogData[]>;
  delete: (logId: string, userId: string) => Promise<void>;
  deleteAll: (userId: string) => Promise<void>;
}
