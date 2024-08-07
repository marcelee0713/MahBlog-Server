import { ExcludeFunctions } from "..";
import { IUser, GetUserParams } from "../../interfaces/user/user.interface";

export type UserRoles = "USER" | "ADMIN";

export type UserStatus = "ACTIVE" | "SUSPENDED" | "BANNED";

export type UserData = ExcludeFunctions<IUser>;

export const UpdateUserUseCaseArr = [
  "CHANGE_PASSWORD",
  "CHANGE_EMAIL",
  "VERIFY_EMAIL",
  "RESET_PASSWORD",
] as const;

export type UpdateUserUseCase = (typeof UpdateUserUseCaseArr)[number];

export type GetUserUseCase = "EMAIL" | "USER_ID" | "BOTH" | "SIGNING_IN";

export type GetUserByEmail = Omit<GetUserParams, "userId">;

export type GetUserById = Omit<GetUserParams, "email">;

export type GetUserParamsType<T extends GetUserUseCase> = ParamMapping[T];

export const GetUserByEmailUseCaseArr = ["VERIFY_EMAIL", "GET_USER_DATA"] as const;

export type GetUserByEmailUseCase = (typeof GetUserByEmailUseCaseArr)[number];

type ParamMapping = {
  BOTH: GetUserParams;
  USER_ID: GetUserById;
  EMAIL: GetUserByEmail;
  SIGNING_IN: GetUserByEmail;
};
