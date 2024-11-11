import {
  UserData,
  GetUserParamsType,
  GetUserUseCase,
  UserRoles,
  UserStatus,
  UpdateUserUseCase,
  AuthenticatedAs,
  SignInParamsType,
} from "../../types/user/user.types";

export interface IUser {
  userId: string;
  email: string;
  emailVerifiedAt?: Date | null;
  createdAt: Date;
  role: UserRoles;
  status: UserStatus;
  getUser: () => UserData;
  getUserId: () => string;
  getEmail: () => string;
  getEmailVerified: () => Date | undefined | null;
  getCreatedAt: () => Date;
  getRole: () => UserRoles;
  getStatus: () => UserStatus;
  setUser: (data: UserData) => void;
  setUserId: (userId: string) => void;
  setEmail: (email: string) => void;
  setEmailVerified: (date?: Date | null) => void;
  setCreatedAt: (date: Date) => void;
  setRole: (role: UserRoles) => void;
  setStatus: (status: UserStatus) => void;
  validateEmail: (email: string) => void;
  validatePassword: (password?: string) => void;
  validate: (email: string, password?: string) => void;
}

export interface IUserService {
  signIn: <T extends AuthenticatedAs>(params: SignInParamsType<T>, type: T) => Promise<string>;
  signOut: (userId: string, sessionId: string) => Promise<void>;
  signOutAll: (userId: string) => Promise<void>;
  signUp: (params: SignUpParams) => Promise<UserData>;
  getUser: (userId: string) => Promise<UserData>;
  getUserByEmail: (email: string) => Promise<UserData>;
  updateEmail: (userId: string, oldEmail: string, newEmail: string) => Promise<void>;
  updatePassword: (userId: string, currentPassword: string, newPassword: string) => Promise<void>;
  verifyEmail: (userId: string, email: string) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
}

export interface IUserRepository {
  create: (params: SignUpParams) => Promise<UserData>;
  get: <T extends GetUserUseCase>(params: GetUserParamsType<T>, type: T) => Promise<UserData>;
  update: (params: UpdateUserParams) => Promise<void>;
  delete: (userId: string) => Promise<void>;
}

export interface GetUserParams {
  userId: string;
  email: string;
  password?: string;
}

export interface SignInParams {
  email: string;
  password: string;
}

export interface SignUpParams {
  firstName: string;
  lastName?: string;
  email: string;
  password?: string;
  authAs: AuthenticatedAs;
}

export interface UpdateUserBodyReq {
  body: {
    userId?: string;
    email?: string;
    newEmail?: string;
    currentPassword?: string;
    password?: string;
    token?: string;
    removeSessions?: boolean;
    useCase: UpdateUserUseCase;
  };
}

export interface UpdateUserParams {
  userId: string;
  email?: string;
  newEmail?: string;
  password?: string;
  newPassword?: string;
  useCase: UpdateUserUseCase;
}
