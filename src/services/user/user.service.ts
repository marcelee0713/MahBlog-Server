import { inject, injectable } from "inversify";
import {
  IUser,
  IUserRepository,
  IUserService,
  SignInParams,
} from "../../interfaces/user/user.interface";
import { UserData, UserUpdateUseCase } from "../../types/user/user.types";
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

    const user = await this.repo.getUserData({ email: email, password: password }, "SIGNING_IN");

    const token = await this.session.createSession(user.userId);

    return token;
  }

  async signOut(userId: string, sessionId: string): Promise<void> {
    await this.session.deleteSession(userId, sessionId);
  }

  async signUp(params: SignInParams): Promise<UserData> {
    this.entity.validate(params.email, params.password);

    this.profile.validate(params.firstName, params.lastName);

    const user = await this.repo.createUser(params);

    return user;
  }

  async getUser(userId: string): Promise<UserData> {
    const user = await this.repo.getUserData({ userId: userId }, "USER_ID");

    return user;
  }

  async updateEmail(userId: string, oldEmail: string, newEmail: string): Promise<void> {
    this.entity.validateEmail(newEmail);

    await this.repo.updateUserData({
      useCase: "CHANGE_EMAIL",
      userId: userId,
      email: oldEmail,
      newEmail: newEmail,
    });
  }

  async updatePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    this.entity.validatePassword(newPassword);

    await this.repo.updateUserData({
      useCase: "CHANGE_PASSWORD",
      userId: userId,
      password: currentPassword,
      newPassword: newPassword,
    });
  }

  async verifyEmail(userId: string, email: string): Promise<void> {
    this.entity.validateEmail(email);

    await this.repo.updateUserData({
      useCase: "VERIFY_EMAIL",
      userId: userId,
      email: email,
    });
  }

  async deleteUser(userId: string): Promise<void> {
    await this.repo.deleteUser(userId);
  }
}
