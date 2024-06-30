import { IUserRepository, SignInParams, UserUpdateParams } from "../interfaces/user.interface";
import { UserData } from "../types/user.types";

export class UserRepository implements IUserRepository {
  async createUser(params: SignInParams): Promise<void> {
    throw Error("Not implemented");
  }
  async getUserData(userId?: string, email?: string): Promise<UserData> {
    throw Error("Not implemented");
  }
  async updateUserData(params: UserUpdateParams): Promise<void> {
    throw Error("Not implemented");
  }
  async deleteUser(userId: string): Promise<void> {
    throw Error("Not implemented");
  }
}
