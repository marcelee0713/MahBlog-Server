import { ExcludeFunctions } from "..";
import { IUserProfile } from "../../interfaces/user/user.profile.interface";

export type UserProfileData = ExcludeFunctions<IUserProfile>;
