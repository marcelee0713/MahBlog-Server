import express from "express";
import * as userContainer from "../config/inversify.config";
import { UserController } from "../controllers/user.controller";
import { TYPES } from "../constants";

const userRouter = express.Router();

const controller = userContainer.container.get<UserController>(TYPES.UserController);

userRouter.get("/", controller.onGetUser.bind(controller));

userRouter.post("/sign-in", controller.onSignIn.bind(controller));

userRouter.post("/sign-up", controller.onSignUp.bind(controller));

export default userRouter;
