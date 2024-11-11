import { injectable } from "inversify";
import { REG_EX } from "../../constants";
import { IUser } from "../../interfaces/user/user.interface";
import { UserData, UserRoles, UserStatus } from "../../types/user/user.types";
import { CustomError } from "../../utils/error_handler";

@injectable()
export class User implements IUser {
  userId!: string;
  email!: string;
  emailVerifiedAt?: Date | null;
  createdAt!: Date;
  role!: UserRoles;
  status!: UserStatus;

  getUserId = () => this.userId;

  getEmail = () => this.email;

  getEmailVerified = () => this.emailVerifiedAt;

  getCreatedAt = () => this.createdAt;

  getRole = () => this.role;

  getStatus = () => this.status;

  getUser = () => {
    const obj: UserData = {
      userId: this.userId,
      email: this.email,
      emailVerifiedAt: this.emailVerifiedAt,
      role: this.role,
      status: this.status,
      createdAt: this.createdAt,
    };

    return obj;
  };

  setUserId = (userId: string) => {
    this.userId = userId;
  };

  setEmail = (email: string) => {
    this.email = email;
  };

  setEmailVerified = (date?: Date | null) => {
    this.emailVerifiedAt = date;
  };

  setCreatedAt = (date: Date) => {
    this.createdAt = date;
  };

  setRole = (role: UserRoles) => {
    this.role = role;
  };

  setStatus = (status: UserStatus) => {
    this.status = status;
  };

  setUser = (data: UserData) => {
    this.userId = data.userId;
    this.email = data.email;
    this.emailVerifiedAt = data.emailVerifiedAt;
    this.role = data.role;
    this.status = data.status;
    this.createdAt = data.createdAt;
  };

  validateEmail = (email: string) => {
    if (!REG_EX.EMAIL.test(email)) throw new CustomError("invalid-email");
  };

  validatePassword = (password?: string) => {
    if (!password) return;

    if (!REG_EX.PASSWORD.test(password)) throw new CustomError("invalid-password");
  };

  validate = (email: string, password?: string) => {
    this.validateEmail(email);
    this.validatePassword(password);
  };
}
