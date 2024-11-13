import { inject, injectable } from "inversify";
import {
  GetUserConnectionsParams,
  GetUserPendingConnectionsParams,
  IUserConnectionRepository,
  IUserConnectionsService,
  UserConnections,
  UserConnectionsCount,
  UserPendingConnections,
  UserUpdateConnectionParams,
} from "../../interfaces/user/user.connections.interface";
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

  async getTotalConnections(params: GetUserConnectionsParams): Promise<UserConnections[]> {
    const res = await this.repo.get(params, "GET_CONNECTIONS");

    return res;
  }

  async getTotalConnectionsCount(userId: string): Promise<UserConnectionsCount> {
    const res = await this.repo.get({ userId }, "GET_COUNT");

    return res;
  }

  async getPendingConnections(
    params: GetUserPendingConnectionsParams
  ): Promise<UserPendingConnections[]> {
    const res = await this.repo.get(params, "GET_PENDING_CONNECTIONS");

    return res;
  }

  async updateConnection(params: UserUpdateConnectionParams): Promise<void> {
    await this.repo.update(params);
  }
}
