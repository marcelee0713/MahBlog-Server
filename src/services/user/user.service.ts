import { inject, injectable } from "inversify";
import {
  IUser,
  IUserRepository,
  IUserService,
  SignInParams,
} from "../../interfaces/user/user.interface";
import { UserData } from "../../types/user/user.types";
import { TYPES } from "../../constants";
import { IUserProfile } from "../../interfaces/user/user.profile.interface";
import { IUserSessionService } from "../../interfaces/user/user.session.interface";

@injectable()
export class UserService implements IUserService {
  private entity: IUser;
  private profile: IUserProfile;
  private repo: IUserRepository;
  private session: IUserSessionService;

  constructor(
    @inject(TYPES.UserModel) entity: IUser,
    @inject(TYPES.UserProfileModel) profile: IUserProfile,
    @inject(TYPES.UserRepository) repo: IUserRepository,
    @inject(TYPES.UserSessionService) session: IUserSessionService
  ) {
    this.entity = entity;
    this.profile = profile;
    this.repo = repo;
    this.session = session;
  }

  async signIn(email: string, password: string): Promise<string> {
    this.entity.validate(email, password);

    const user = await this.repo.getUserData({ email: email, password: password }, "EMAIL");

    const token = await this.session.createSession(user.userId);

    return token;
  }

  async signOut(userId: string, sessionId: string): Promise<void> {
    await this.session.deleteSession(userId, sessionId);
  }

  async signUp(params: SignInParams): Promise<void> {
    this.entity.validate(params.email, params.password);

    this.profile.validate(params.firstName, params.lastName);

    await this.repo.createUser(params);
  }

  async getUser(userId: string): Promise<UserData> {
    const user = await this.repo.getUserData({ userId: userId }, "USER_ID");

    return user;
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
