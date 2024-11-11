import { injectable } from "inversify";
import { IUserProfile } from "../../interfaces/user/user.profile.interface";
import { UserProfileData } from "../../types/user/user.profile.types";
import { CustomError } from "../../utils/error_handler";

@injectable()
export class UserProfile implements IUserProfile {
  profileId!: string;
  userId!: string;
  firstName!: string;
  lastName?: string | null;
  middleName?: string | null;
  profilePicture?: string | null;
  profileCover?: string | null;
  bio?: string | null;

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

  setMiddleName = (middleName?: string | null) => {
    this.middleName = middleName;
  };

  setLastName = (lastName?: string | null) => {
    this.lastName = lastName;
  };

  setPfp = (pfp?: string | null) => {
    this.profilePicture = pfp;
  };

  setCover = (cover?: string | null) => {
    this.profileCover = cover;
  };

  setBio = (bio?: string | null) => {
    this.bio = bio;
  };

  validate = (
    firstName: string,
    lastName?: string | null,
    middleName?: string | null,
    bio?: string | null
  ) => {
    this.validateFirstname(firstName);
    this.validateLastName(lastName);
    this.validateMiddleName(middleName);
    this.validateBio(bio);
  };

  validateFirstname = (firstName: string) => {
    if (firstName.length < 2) throw new CustomError("invalid-first-name");

    if (firstName.length > 50) throw new CustomError("invalid-first-name");
  };

  validateLastName = (lastName?: string | null) => {
    if (!lastName) return;

    if (lastName.length < 2) throw new CustomError("invalid-last-name");

    if (lastName.length > 80) throw new CustomError("invalid-last-name");
  };

  validateMiddleName = (middleName?: string | null) => {
    if (!middleName) return;

    if (middleName.length < 2) throw new CustomError("invalid-middle-name");

    if (middleName.length > 50) throw new CustomError("invalid-middle-name");
  };

  validateBio = (bio?: string | null) => {
    if (!bio) return;

    if (bio.length > 255) throw new CustomError("invalid-bio");
  };
}
