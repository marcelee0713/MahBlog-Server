import { SortOrder } from "../../types";
import {
  ConnectionStatus,
  GetConnectionReturnType,
  GetConnectionsParamsType,
  GetConnectionsUseCase,
} from "../../types/user/user.connections.types";

export interface IUserConnections {
  connectionId: string;
  sourceUserId: string;
  targetUserId: string;
  status: ConnectionStatus;
  createdAt: Date;
  updatedAt: Date | null;
}

export interface IUserConnectionsService {
  createConnection: (sourceUserId: string, targetUserId: string) => Promise<void>;
  getTotalConnections: (userId: string, searchNameInput?: string) => Promise<UserConnections[]>;
  getTotalConnectionsCount: (userId: string) => Promise<UserConnectionsCount>;
  getPendingConnections: (
    userId: string,
    dateOrder: SortOrder
  ) => Promise<UserPendingConnections[]>;
  updateConnection: (
    sourceUserId: string,
    targetUserId: string,
    status: ConnectionStatus
  ) => Promise<void>;
}

export interface IUserConnectionRepository {
  create: (sourceId: string, targetUserId: string) => Promise<void>;
  get: <T extends GetConnectionsUseCase>(
    params: GetConnectionsParamsType<T>,
    type: T
  ) => Promise<GetConnectionReturnType<T>>;
  update: (sourceUserId: string, targetUserId: string, status: ConnectionStatus) => Promise<void>;
}

export interface UserConnectionsCount {
  userId: string;
  count: number;
}

export interface UserConnections {
  name: string;
  profilePicture: string;
}

export interface UserPendingConnections extends UserConnections {
  createdAt: Date;
}

export interface UserConnectionsCountParams {
  userId: string;
}

export interface UserTotalConnectionsParams extends UserConnectionsCountParams {
  searchNameInput?: string;
}

export interface UserTotalPendingConnectionsParams extends UserConnectionsCountParams {
  dateOrder: SortOrder;
}
