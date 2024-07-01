import { Container } from "inversify";
import { IUser, IUserRepository, IUserService } from "../../interfaces/user.interface";
import { TYPES } from "../../constants";
import { User } from "../../models/user.model";
import { UserService } from "../../services/user.service";
import { UserRepository } from "../../repositories/user.repo";
import { UserController } from "../../controllers/user.controller";

export const container = new Container();

container.bind<IUser>(TYPES.UserModel).to(User);
container.bind<IUserService>(TYPES.UserService).to(UserService);
container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);
container.bind(TYPES.UserController).to(UserController);
