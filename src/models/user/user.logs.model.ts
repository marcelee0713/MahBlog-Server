import { injectable } from "inversify";
import { DEFAULT_LOG_CONTENT, UPDATE_DAYS_COOLDOWN } from "../../constants";
import { IUserLogs } from "../../interfaces/user/user.logs.interface";
import { LogType } from "../../types/user/user.logs.types";

@injectable()
export class UserLogs implements IUserLogs {
  logId!: string;
  content!: string;
  type!: LogType;
  createdAt!: Date;

  getLogId = () => this.logId;

  getContent = () => this.content;

  getType = () => this.type;

  getCreatedAt = () => this.createdAt;

  setLogId = (logId: string) => {
    this.logId = logId;
  };

  setContent = (content: string) => {
    this.content = content;
  };

  setType = (type: LogType) => {
    this.type = type;
  };

  setCreatedAt = (date: Date) => {
    this.createdAt = date;
  };

  canUpdate = (createdAt: Date): boolean => {
    const date = createdAt.setDate(createdAt.getDate() + UPDATE_DAYS_COOLDOWN.NAME_AND_EMAIL);
    const today = new Date().getTime();

    return today >= date;
  };

  getDefaultContent = (type: LogType) => DEFAULT_LOG_CONTENT[type];
}
