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
  updateConnection: (params: UserUpdateConnectionParams) => Promise<void>;
}

export interface IUserConnectionRepository {
  create: (sourceId: string, targetUserId: string) => Promise<void>;
  get: <T extends GetConnectionsUseCase>(
    params: GetConnectionsParamsType<T>,
    type: T
  ) => Promise<GetConnectionReturnType<T>>;
  update: (params: UserUpdateConnectionParams) => Promise<void>;
}

export interface UserConnectionsCount {
  userId: string;
  count: number;
}

export interface UserConnections {
  connectionId: string;
  userId: string;
  name: string;
  profilePicture: string | null;
}

export interface UserPendingConnections {
  connectionId: string;
  userId: string;
  name: string;
  profilePicture: string | null;
  createdAt: Date;
}

export interface GetUserConnectionsCountParams {
  userId: string;
}

export interface GetUserTotalConnectionsParams extends GetUserConnectionsCountParams {
  searchNameInput?: string;
}

export interface GetUserTotalPendingConnectionsParams extends GetUserConnectionsCountParams {
  dateOrder: SortOrder;
}

export interface UserUpdateConnectionParams {
  connectionId: string;
  sourceUserId: string;
  targetUserId: string;
  status: ConnectionStatus;
}
