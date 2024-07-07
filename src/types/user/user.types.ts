import { ExcludeFunctions } from "..";
import { IUser, UserGetParams } from "../../interfaces/user/user.interface";

export type UserRoles = "USER" | "ADMIN";

export type UserStatus = "ACTIVE" | "SUSPENDED" | "BANNED";

export type UserData = ExcludeFunctions<IUser>;

export const UserUpdateUseCaseArr = ["CHANGE_PASSWORD", "CHANGE_EMAIL", "VERIFY_EMAIL"] as const;

export type UserUpdateUseCase = (typeof UserUpdateUseCaseArr)[number];

export type UserGetUseCase = "EMAIL" | "USER_ID" | "BOTH" | "SIGNING_IN";

export type UserGetByEmail = Omit<UserGetParams, "userId">;

export type UserGetById = Omit<UserGetParams, "email">;

export type UserGetType<T extends UserGetUseCase> = ParamMapping[T];

export const UserGetByEmailUseCaseArr = ["VERIFY_EMAIL", "GET_USER_DATA"] as const;

export type UserGetByEmailUseCase = (typeof UserGetByEmailUseCaseArr)[number];

type ParamMapping = {
  BOTH: UserGetParams;
  USER_ID: UserGetById;
  EMAIL: UserGetByEmail;
  SIGNING_IN: UserGetByEmail;
};
