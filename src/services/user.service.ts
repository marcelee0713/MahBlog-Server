import { inject, injectable } from "inversify";
import {
  IUser,
  IUserRepository,
  IUserService,
  SignInParams,
} from "../interfaces/user/user.interface";
import { UserData } from "../types/user/user.types";
import { TYPES } from "../constants";
import { IUserProfile } from "../interfaces/user/user_profile.interface";

@injectable()
export class UserService implements IUserService {
  private entity: IUser;
  private profile: IUserProfile;
  private repo: IUserRepository;

  constructor(
    @inject(TYPES.UserModel) entity: IUser,
    @inject(TYPES.UserProfileModel) profile: IUserProfile,
    @inject(TYPES.UserRepository) repo: IUserRepository
  ) {
    this.entity = entity;
    this.profile = profile;
    this.repo = repo;
  }

  async signIn(email: string, password: string): Promise<string> {
    this.entity.validate(email, password);

    const user = await this.repo.getUserData(undefined, email);

    return user.userId;
  }

  async signOut(userId: string, sessionId: string): Promise<void> {
    throw Error("Unused");
  }

  async signUp(params: SignInParams): Promise<void> {
    this.entity.validate(params.email, params.password);

    this.profile.validate(params.firstName, params.lastName);

    await this.repo.createUser(params);
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
