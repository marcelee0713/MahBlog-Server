import { ExcludeFunctions } from "..";
import { IUser, UserGetParams } from "../../interfaces/user/user.interface";

export type UserRoles = "USER" | "ADMIN";

export type UserStatus = "ACTIVE" | "SUSPENDED" | "BANNED";

export type UserData = ExcludeFunctions<IUser>;

export type UserUpdateUseCase = "CHANGE_PASSWORD" | "CHANGE_EMAIL" | "VERIFY_EMAIL";

export type UserGetUseCase = "EMAIL" | "USER_ID" | "BOTH";

export type UserGetByEmail = Omit<UserGetParams, "userId">;

export type UserGetById = Omit<UserGetParams, "email">;

export type UserGetType<T extends UserGetUseCase> = ParamMapping[T];

type ParamMapping = {
  BOTH: UserGetParams;
  USER_ID: UserGetById;
  EMAIL: UserGetByEmail;
};
