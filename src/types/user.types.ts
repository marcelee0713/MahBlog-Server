import { IUser } from "../interfaces/user.interface";

export type UserRoles = "USER" | "ADMIN";

export type UserStatus = "ACTIVE" | "SUSPENDED" | "BANNED";

export type UserData = ExcludeFunctions<IUser>;

export type UserUpdateUseCase = "CHANGE PASSWORD" | "CHANGE EMAIL";

type FunctionKey<T> = {
  [K in keyof T]: T[K] extends CallableFunction ? K : never;
}[keyof T];

export type ExcludeFunctions<T> = Omit<T, FunctionKey<T>>;
