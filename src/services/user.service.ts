import { inject, injectable } from "inversify";
import { IUser, IUserRepository, IUserService, SignInParams } from "../interfaces/user.interface";
import { UserData } from "../types/user.types";
import { TYPES } from "../constants";

@injectable()
export class UserService implements IUserService {
  private entity: IUser;
  private repo: IUserRepository;

  constructor(
    @inject(TYPES.UserModel) entity: IUser,
    @inject(TYPES.UserRepository) repo: IUserRepository
  ) {
    this.entity = entity;
    this.repo = repo;
  }

  async signIn(email: string, password: string): Promise<string> {
    throw Error("Unused");
  }

  async signOut(userId: string, sessionId: string): Promise<void> {
    throw Error("Unused");
  }

  async signUp(params: SignInParams): Promise<void> {
    throw new Error("Method not implemented.");
  }
  async getUser(userId: string): Promise<UserData> {
    throw new Error("Method not implemented.");
  }
  async updateEmail(userId: string, oldEmail: string, newEmail: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  async updatePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    throw new Error("Method not implemented.");
  }
  async verifyEmail(userId: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  async deleteUser(userId: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
