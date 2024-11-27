import { ExcludeFunctions } from "..";
import {
  IUserProfile,
  UpdateUserProfileParams,
} from "../../interfaces/user/user.profile.interface";

export type UserProfileData = ExcludeFunctions<IUserProfile>;

export type UserProfileMinimizedData = Pick<
  UserProfileData,
  "userId" | "profilePicture" | "firstName" | "middleName" | "lastName"
> & {
  email: string;
};

export type DeleteUserProfileUseCase = "BIO" | "PROFILE_IMAGE" | "COVER_IMAGE";

export type UpdateUserProfileUseCase = "BIO" | "NAME" | "PROFILE_IMAGE" | "COVER_IMAGE";

export type UpdateUserProfileByBio = Omit<
  UpdateUserProfileParams,
  "fName" | "lName" | "mName" | "imageUrl"
>;

export type UpdateUserProfileByName = Omit<UpdateUserProfileParams, "bio" | "imageUrl">;

export type UpdateUserProfileByImage = Omit<
  UpdateUserProfileParams,
  "fName" | "lName" | "mName" | "bio"
>;

export type UpdateUserProfileParamsType<T extends UpdateUserProfileUseCase> = ParamMapping[T];

type ParamMapping = {
  BIO: UpdateUserProfileByBio;
  NAME: UpdateUserProfileByName;
  PROFILE_IMAGE: UpdateUserProfileByImage;
  COVER_IMAGE: UpdateUserProfileByImage;
};
