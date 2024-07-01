import express from "express";
import * as userContainer from "../config/inversify/user.config";
import { UserController } from "../controllers/user.controller";
import { TYPES } from "../constants";

const userRouter = express.Router();

const controller = userContainer.container.get<UserController>(TYPES.UserController);

userRouter.get("/", controller.onGetUser.bind(controller));

export default userRouter;
