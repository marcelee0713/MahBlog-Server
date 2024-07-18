import { ExcludeFunctions } from "..";
import {
  IUserProfile,
  UserProfileUpdateParams,
} from "../../interfaces/user/user.profile.interface";

export type UserProfileData = ExcludeFunctions<IUserProfile>;

export type UserProfileRemoveUseCase = "BIO" | "PROFILE_IMAGE" | "COVER_IMAGE";

export type UserProfileUpdateUseCase = "BIO" | "NAME" | "PROFILE_IMAGE" | "COVER_IMAGE";

export type UserProfileUpdateByBio = Omit<
  UserProfileUpdateParams,
  "fName" | "lName" | "mName" | "imageUrl"
>;

export type UserProfileUpdateByName = Omit<UserProfileUpdateParams, "bio" | "imageUrl">;

export type UserProfileUpdateByImage = Omit<
  UserProfileUpdateParams,
  "fName" | "lName" | "mName" | "bio"
>;

export type UserProfileUpdateType<T extends UserProfileUpdateUseCase> = ParamMapping[T];

type ParamMapping = {
  BIO: UserProfileUpdateByBio;
  NAME: UserProfileUpdateByName;
  PROFILE_IMAGE: UserProfileUpdateByImage;
  COVER_IMAGE: UserProfileUpdateByImage;
};
