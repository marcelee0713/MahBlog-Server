import { ExcludeFunctions } from "..";
import { IUser } from "../../interfaces/user/user.interface";

export type UserRoles = "USER" | "ADMIN";

export type UserStatus = "ACTIVE" | "SUSPENDED" | "BANNED";

export type UserData = ExcludeFunctions<IUser>;

export type UserUpdateUseCase = "CHANGE_PASSWORD" | "CHANGE_EMAIL" | "VERIFY_EMAIL";
