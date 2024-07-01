import { UserProfileData } from "../../types/user/user_profile.types";

export interface IUserProfile {
  profileId: string;
  userId: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  profilePicture?: string;
  profileCover?: string;
  bio?: string;
  getProfile: () => UserProfileData;
  getProfileId: () => string;
  getUserId: () => string;
  getFirstName: () => string;
  getMiddleName: () => string | undefined;
  getLastName: () => string | undefined;
  getProfilePicture: () => string | undefined;
  getCover: () => string | undefined;
  getBio: () => string | undefined;
  setProfile: (data: UserProfileData) => void;
  setProfileId: (profileId: string) => void;
  setUserId: (userId: string) => void;
  setFirstName: (firstName: string) => void;
  setMiddleName: (middleName?: string) => void;
  setLastName: (lastName: string) => void;
  setPfp: (pfp?: string) => void;
  setCover: (cover?: string) => void;
  setBio: (bio?: string) => void;
  validate: (firstName: string, lastName: string, middleName?: string, bio?: string) => void;
  validateFirstname: (firstName: string) => void;
  validateLastName: (lastName: string) => void;
  validateMiddleName: (middleName?: string) => void;
  validateBio: (bio?: string) => void;
}

export interface IUserService {}

// TODO: Soon do the use cases of UserProfile that includes services, repo, and etc..
