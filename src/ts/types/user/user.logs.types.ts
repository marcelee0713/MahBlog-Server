import { ExcludeFunctions } from "..";
import { IUserLogs } from "../../interfaces/user/user.logs.interface";

export type UserLogData = ExcludeFunctions<IUserLogs>;

export type LogType = "UPDATE_PASSWORD" | "UPDATE_EMAIL" | "UPDATE_NAME" | "OTHER";
