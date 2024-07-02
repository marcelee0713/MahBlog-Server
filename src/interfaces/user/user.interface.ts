import {
  UserData,
  UserGetType,
  UserGetUseCase,
  UserRoles,
  UserStatus,
  UserUpdateUseCase,
} from "../../types/user/user.types";

export interface IUser {
  userId: string;
  email: string;
  emailVerifiedAt?: Date;
  createdAt: Date;
  role: UserRoles;
  status: UserStatus;
  getUser: () => UserData;
  getUserId: () => string;
  getEmail: () => string;
  getEmailVerified: () => Date | undefined;
  getCreatedAt: () => Date;
  getRole: () => UserRoles;
  getStatus: () => UserStatus;
  setUser: (data: UserData) => void;
  setUserId: (userId: string) => void;
  setEmail: (email: string) => void;
  setEmailVerified: (date: Date | undefined) => void;
  setCreatedAt: (date: Date) => void;
  setRole: (role: UserRoles) => void;
  setStatus: (status: UserStatus) => void;
  validateEmail: (email: string) => void;
  validatePassword: (password: string) => void;
  validate: (email: string, password: string) => void;
}

export interface IUserService {
  signIn: (email: string, password: string) => Promise<string>;
  signOut: (userId: string, sessionId: string) => Promise<void>;
  signUp: (params: SignInParams) => Promise<void>;
  getUser: (userId: string) => Promise<UserData>;
  updateEmail: (userId: string, oldEmail: string, newEmail: string) => Promise<void>;
  updatePassword: (userId: string, currentPassword: string, newPassword: string) => Promise<void>;
  verifyEmail(userId: string): Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
}

export interface IUserRepository {
  createUser: (params: SignInParams) => Promise<void>;
  getUserData: <T extends UserGetUseCase>(params: UserGetType<T>, type: T) => Promise<UserData>;
  updateUserData: (params: UserUpdateParams) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
}

export interface UserGetParams {
  userId: string;
  email: string;
  password?: string;
}

export interface SignInParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface UserUpdateParams {
  userId: string;
  email?: string;
  password?: string;
  useCase: UserUpdateUseCase;
}
