import { ExcludeFunctions } from "..";
import { IUserProfile } from "../../interfaces/user/user_profile.interface";

export type UserProfileData = ExcludeFunctions<IUserProfile>;
