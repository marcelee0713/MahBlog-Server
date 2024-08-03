import { inject, injectable } from "inversify";
import {
  IUserConnectionRepository,
  IUserConnectionsService,
  UserConnections,
  UserConnectionsCount,
  UserPendingConnections,
  UserUpdateConnectionParams,
} from "../../interfaces/user/user.connections.interface";
import { SortOrder } from "../../types";
import { TYPES } from "../../constants";

@injectable()
export class UserConnectionsService implements IUserConnectionsService {
  private repo: IUserConnectionRepository;

  constructor(@inject(TYPES.UserConnectionsRepository) repo: IUserConnectionRepository) {
    this.repo = repo;
  }

  async createConnection(sourceUserId: string, targetUserId: string): Promise<void> {
    await this.repo.create(sourceUserId, targetUserId);
  }

  async getTotalConnections(userId: string, searchNameInput?: string): Promise<UserConnections[]> {
    const res = await this.repo.get({ userId, searchNameInput }, "GET_CONNECTIONS");

    return res;
  }

  async getTotalConnectionsCount(userId: string): Promise<UserConnectionsCount> {
    const res = await this.repo.get({ userId }, "GET_COUNT");

    return res;
  }

  async getPendingConnections(
    userId: string,
    dateOrder: SortOrder
  ): Promise<UserPendingConnections[]> {
    const res = await this.repo.get({ userId, dateOrder }, "GET_PENDING_CONNECTIONS");

    return res;
  }

  async updateConnection(params: UserUpdateConnectionParams): Promise<void> {
    await this.repo.update(params);
  }
}
