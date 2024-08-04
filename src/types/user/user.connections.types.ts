import { RequestBody } from "..";
import {
  UserConnections,
  UserConnectionsCount,
  GetUserConnectionsCountParams,
  UserPendingConnections,
  GetUserTotalConnectionsParams,
  GetUserTotalPendingConnectionsParams,
  UserUpdateConnectionParams,
} from "../../interfaces/user/user.connections.interface";

export const ConnectionStatusArr = ["PENDING", "ACCEPTED", "REJECTED", "BLOCKED"] as const;

export type ConnectionStatus = (typeof ConnectionStatusArr)[number];

export type GetConnectionsUseCase = "GET_CONNECTIONS" | "GET_PENDING_CONNECTIONS" | "GET_COUNT";

export type GetConnectionsParamsType<T extends GetConnectionsUseCase> = ParamMapping[T];

export type GetConnectionReturnType<T extends GetConnectionsUseCase> = ReturnMapping[T];

type ParamMapping = {
  GET_CONNECTIONS: GetUserTotalConnectionsParams;
  GET_PENDING_CONNECTIONS: GetUserTotalPendingConnectionsParams;
  GET_COUNT: GetUserConnectionsCountParams;
};

type ReturnMapping = {
  GET_CONNECTIONS: UserConnections[];
  GET_PENDING_CONNECTIONS: UserPendingConnections[];
  GET_COUNT: UserConnectionsCount;
};

export type UpdateUserConnectionReqBody = RequestBody<UserUpdateConnectionParams>;
