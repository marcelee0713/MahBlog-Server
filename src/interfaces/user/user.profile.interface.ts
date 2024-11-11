import {
  UserProfileData,
  DeleteUserProfileUseCase,
  UpdateUserProfileParamsType,
  UpdateUserProfileUseCase,
} from "../../types/user/user.profile.types";

export interface IUserProfile {
  profileId: string;
  userId: string;
  firstName: string;
  lastName?: string | null;
  middleName?: string | null;
  profilePicture?: string | null;
  profileCover?: string | null;
  bio?: string | null;
  getProfile: () => UserProfileData;
  getProfileId: () => string;
  getUserId: () => string;
  getFirstName: () => string;
  getMiddleName: () => string | null | undefined;
  getLastName: () => string | null | undefined;
  getProfilePicture: () => string | null | undefined;
  getCover: () => string | null | undefined;
  getBio: () => string | null | undefined;
  setProfile: (data: UserProfileData) => void;
  setProfileId: (profileId: string) => void;
  setUserId: (userId: string) => void;
  setFirstName: (firstName: string) => void;
  setMiddleName: (middleName?: string | null) => void;
  setLastName: (lastName: string) => void;
  setPfp: (pfp: string | null) => void;
  setCover: (cover: string | null) => void;
  setBio: (bio: string | null) => void;
  validate: (
    firstName: string,
    lastName: string | null | undefined,
    middleName?: string | null,
    bio?: string | null
  ) => void;
  validateFirstname: (firstName: string) => void;
  validateLastName: (lastName: string | null | undefined) => void;
  validateMiddleName: (middleName?: string | null) => void;
  validateBio: (bio?: string | null) => void;
}

export interface IUserProfileService {
  getUserProfile: (userId: string) => Promise<UserProfileData>;
  updateName: (userId: string, fName: string, lName?: string, mName?: string) => Promise<void>;
  updateBio: (userId: string, bio: string) => Promise<void>;
  updateProfileImage: (userId: string, imageUrl: string) => Promise<void>;
  updateCoverImage: (userId: string, imageUrl: string) => Promise<void>;
  remove: (userId: string, type: DeleteUserProfileUseCase) => Promise<void>;
}

export interface IUserProfileRepository {
  get: (userId: string) => Promise<UserProfileData>;
  delete: (userId: string, type: DeleteUserProfileUseCase) => Promise<void>;
  update: <T extends UpdateUserProfileUseCase>(
    params: UpdateUserProfileParamsType<T>,
    type: T
  ) => Promise<void>;
}

export interface UpdateUserProfileParams {
  userId: string;
  fName: string;
  lName?: string;
  imageUrl: string;
  mName?: string;
  bio: string;
}
