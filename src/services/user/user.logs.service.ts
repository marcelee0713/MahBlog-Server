import { inject, injectable } from "inversify";
import {
  IUserLogs,
  IUserLogsRepository,
  IUserLogsService,
} from "../../interfaces/user/user.logs.interface";
import { LogType, UserLogData } from "../../types/user/user.logs.types";
import { TYPES } from "../../constants";
import { ErrorType } from "../../types";

@injectable()
export class UserLogsService implements IUserLogsService {
  private entity: IUserLogs;
  private repo: IUserLogsRepository;

  constructor(
    @inject(TYPES.UserLogs) entity: IUserLogs,
    @inject(TYPES.UserLogsRepository) repo: IUserLogsRepository
  ) {
    this.entity = entity;
    this.repo = repo;
  }

  async addLog(userId: string, type: LogType): Promise<void> {
    const content = this.entity.getDefaultContent(type);

    await this.repo.add(userId, type, content);
  }

  async updateable(userId: string, type: LogType): Promise<boolean> {
    const log = await this.repo.get(userId, type);

    if (!log) return true;

    const canUpdate = this.entity.canUpdate(log.createdAt);

    if (canUpdate) true;

    return false;
  }

  async getLog(userId: string, type?: LogType): Promise<UserLogData> {
    const log = await this.repo.get(userId, type);

    if (!log) throw new Error("user-log-does-not-exist" as ErrorType);

    return log;
  }

  async getLogs(userId: string, type?: LogType): Promise<UserLogData[]> {
    const logs = await this.getLogs(userId, type);

    return logs;
  }

  async deleteLog(userId: string, logId: string): Promise<void> {
    await this.repo.delete(userId, logId);
  }

  async deleteLogs(userId: string): Promise<void> {
    await this.repo.deleteAll(userId);
  }
}
