import { Container } from "inversify";
import { IUser, IUserRepository, IUserService } from "../interfaces/user/user.interface";
import { TYPES } from "../constants";
import { User } from "../models/user/user.model";
import { UserService } from "../services/user.service";
import { UserRepository } from "../repositories/user.repo";
import { UserController } from "../controllers/user.controller";
import { IUserProfile } from "../interfaces/user/user_profile.interface";
import { UserProfile } from "../models/user/user_profile.model";

export const container = new Container();

// User
container.bind<IUser>(TYPES.UserModel).to(User);
container.bind<IUserService>(TYPES.UserService).to(UserService);
container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);
container.bind(TYPES.UserController).to(UserController);

// User Profile
container.bind<IUserProfile>(TYPES.UserProfileModel).to(UserProfile);
