import { injectable } from "inversify";
import { IUserProfile } from "../../interfaces/user/user_profile.interface";
import { ErrorType } from "../../types";
import { UserProfileData } from "../../types/user/user_profile.types";

@injectable()
export class UserProfile implements IUserProfile {
  profileId!: string;
  userId!: string;
  firstName!: string;
  lastName!: string;
  middleName?: string;
  profilePicture?: string;
  profileCover?: string;
  bio?: string;

  getProfile = () => {
    const obj: UserProfileData = {
      profileId: this.profileId,
      userId: this.userId,
      firstName: this.firstName,
      lastName: this.lastName,
      middleName: this.middleName,
      bio: this.bio,
      profileCover: this.profileCover,
      profilePicture: this.profilePicture,
    };

    return obj;
  };

  getProfileId = () => this.profileId;

  getUserId = () => this.userId;

  getFirstName = () => this.firstName;

  getMiddleName = () => this.middleName;

  getLastName = () => this.lastName;

  getProfilePicture = () => this.profilePicture;

  getCover = () => this.profileCover;

  getBio = () => this.bio;

  setProfile = (data: UserProfileData) => {
    this.setProfileId(data.userId);
    this.setUserId(data.userId);
    this.setFirstName(data.firstName);
    this.setLastName(data.lastName);
    this.setMiddleName(data.middleName);
    this.setPfp(data.profilePicture);
    this.setCover(data.profileCover);
    this.setBio(data.bio);
  };

  setProfileId = (profileId: string) => {
    this.profileId = profileId;
  };

  setUserId = (userId: string) => {
    this.userId = userId;
  };

  setFirstName = (firstName: string) => {
    this.firstName = firstName;
  };

  setMiddleName = (middleName?: string) => {
    this.middleName = middleName;
  };

  setLastName = (lastName: string) => {
    this.lastName = lastName;
  };

  setPfp = (pfp?: string) => {
    this.profilePicture = pfp;
  };

  setCover = (cover?: string) => {
    this.profileCover = cover;
  };

  setBio = (bio?: string) => {
    this.bio = bio;
  };

  validate = (firstName: string, lastName: string, middleName?: string, bio?: string) => {
    this.validateFirstname(firstName);
    this.validateLastName(lastName);
    this.validateMiddleName(middleName);
    this.validateBio(bio);
  };

  validateFirstname = (firstName: string) => {
    if (firstName.length < 2) throw new Error("invalid-first-name" as ErrorType);

    if (firstName.length > 50) throw new Error("invalid-first-name" as ErrorType);
  };

  validateLastName = (lastName: string) => {
    if (lastName.length < 2) throw new Error("invalid-last-name" as ErrorType);

    if (lastName.length > 80) throw new Error("invalid-last-name" as ErrorType);
  };

  validateMiddleName = (middleName?: string) => {
    if (!middleName) return;

    if (middleName.length < 2) throw new Error("invalid-middle-name" as ErrorType);

    if (middleName.length > 50) throw new Error("invalid-middle-name" as ErrorType);
  };

  validateBio = (bio?: string) => {
    if (!bio) return;

    if (bio.length > 255) throw new Error("invalid-bio" as ErrorType);
  };
}
