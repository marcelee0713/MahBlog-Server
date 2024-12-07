import { inject, injectable } from "inversify";
import {
  IUser,
  IUserRepository,
  IUserService,
  SignUpParams,
} from "../../ts/interfaces/user/user.interface";
import { AuthenticatedAs, SignInParamsType, UserData } from "../../ts/types/user/user.types";
import { TYPES } from "../../constants";
import { IUserProfile } from "../../ts/interfaces/user/user.profile.interface";
import { IUserSessionService } from "../../ts/interfaces/user/user.session.interface";
import { CustomError } from "../../utils/error_handler";

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

  async signIn<T extends AuthenticatedAs>(params: SignInParamsType<T>, type: T): Promise<string> {
    const user = await this.repo.get({ ...params }, "SIGNING_IN");

    if (user.authenticatedAs !== type) {
      let message =
        "Please sign in using your email and password, as your account was created through the traditional sign-in method.";

      if (user.authenticatedAs === "LOCAL" && type !== "LOCAL") {
        throw new CustomError("wrong-authentication-type", message);
      }

      if (user.authenticatedAs !== "LOCAL") {
        message = `Please sign in through ${user.authenticatedAs}, as your account was created through that method.`;
      }

      throw new CustomError("invalid", message);
    }

    const token = await this.session.createSession(user.userId);

    return token;
  }

  async signOut(userId: string, sessionId: string): Promise<void> {
    await this.session.deleteSession(userId, sessionId);
  }

  async signOutAll(userId: string): Promise<void> {
    await this.session.deleteSessions(userId);
  }

  async signUp(params: SignUpParams): Promise<UserData> {
    this.entity.validate(params.email, params.password);

    this.profile.validate(params.firstName, params.email);

    const user = await this.repo.create(params);

    return user;
  }

  async getUser(userId: string): Promise<UserData> {
    const user = await this.repo.get({ userId: userId }, "USER_ID");

    return user;
  }

  async getUserByEmail(email: string): Promise<UserData | null> {
    try {
      const user = await this.repo.get({ email: email }, "EMAIL");

      return user;
    } catch (err) {
      return null;
    }
  }

  async updateEmail(userId: string, oldEmail: string, newEmail: string): Promise<void> {
    this.entity.validateEmail(newEmail);

    await this.repo.update({
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

    await this.repo.update({
      useCase: "CHANGE_PASSWORD",
      userId: userId,
      password: currentPassword,
      newPassword: newPassword,
    });
  }

  async resetPassword(userId: string, newPassword: string): Promise<void> {
    this.entity.validatePassword(newPassword);

    await this.repo.update({
      useCase: "RESET_PASSWORD",
      userId: userId,
      newPassword: newPassword,
    });
  }

  async verifyEmail(userId: string, email: string): Promise<void> {
    this.entity.validateEmail(email);

    await this.repo.update({
      useCase: "VERIFY_EMAIL",
      userId: userId,
      email: email,
    });
  }

  async deleteUser(userId: string): Promise<void> {
    await this.repo.delete(userId);
  }
}
