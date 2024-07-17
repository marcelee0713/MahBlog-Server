import { inject, injectable } from "inversify";
import { IUserProfile, IUserProfileService } from "../../interfaces/user/user.profile.interface";
import { UserProfileData } from "../../types/user/user.profile.types";
import { TYPES } from "../../constants";

@injectable()
export class UserProfileService implements IUserProfileService {
  private entity: IUserProfile;

  constructor(@inject(TYPES.UserProfileModel) entity: IUserProfile) {
    this.entity = entity;
  }

  async getUserProfile(userId: string): Promise<UserProfileData> {
    throw new Error("Not implemented");
  }

  async updateName(userId: string, fName: string, lName: string, mName?: string): Promise<void> {}

  async updateBio(userId: string, bio?: string): Promise<string> {
    throw new Error("Not implemented");
  }

  async updateProfileImage(userId: string, imageUrl: string): Promise<void> {
    throw new Error("Not implemented");
  }
}
