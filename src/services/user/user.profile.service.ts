import { inject, injectable } from "inversify";
import {
  IUserProfile,
  IUserProfileRepository,
  IUserProfileService,
} from "../../interfaces/user/user.profile.interface";
import {
  UserProfileData,
  DeleteUserProfileUseCase,
  UserProfileMinimizedData,
} from "../../types/user/user.profile.types";
import { TYPES } from "../../constants";
import { IUserRepository } from "../../interfaces/user/user.interface";

@injectable()
export class UserProfileService implements IUserProfileService {
  private entity: IUserProfile;
  private repo: IUserProfileRepository;
  private userRepo: IUserRepository;

  constructor(
    @inject(TYPES.UserProfileModel) entity: IUserProfile,
    @inject(TYPES.UserProfileRepository) repo: IUserProfileRepository,
    @inject(TYPES.UserRepository) userRepo: IUserRepository
  ) {
    this.entity = entity;
    this.repo = repo;
    this.userRepo = userRepo;
  }

  async getUserProfileByEmail(email: string): Promise<UserProfileMinimizedData> {
    const user = await this.userRepo.get({ email }, "EMAIL");

    const profile = await this.repo.get(user.userId);

    const obj: UserProfileMinimizedData = {
      email,
      userId: user.userId,
      firstName: profile.firstName,
      lastName: profile.lastName,
      middleName: profile.middleName,
      profilePicture: profile.profilePicture,
    };

    return obj;
  }

  async getUserProfile(userId: string): Promise<UserProfileData> {
    return await this.repo.get(userId);
  }

  async updateName(userId: string, fName: string, lName?: string, mName?: string): Promise<void> {
    this.entity.validate(fName, lName, mName);

    return await this.repo.update({ fName, lName, userId, mName }, "NAME");
  }

  async updateBio(userId: string, bio: string): Promise<void> {
    this.entity.validateBio(bio);

    return await this.repo.update({ userId, bio }, "BIO");
  }

  async updateProfileImage(userId: string, imageUrl: string): Promise<void> {
    return await this.repo.update({ userId, imageUrl }, "PROFILE_IMAGE");
  }

  async updateCoverImage(userId: string, imageUrl: string): Promise<void> {
    return await this.repo.update({ userId, imageUrl }, "COVER_IMAGE");
  }

  async remove(userId: string, type: DeleteUserProfileUseCase): Promise<void> {
    return await this.repo.delete(userId, type);
  }
}
