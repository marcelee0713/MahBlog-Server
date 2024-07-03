import express from "express";
import * as userContainer from "../config/inversify.config";
import { UserController } from "../controllers/user.controller";
import { TYPES } from "../constants";
import { UserMiddleware } from "../middlewares/user.middleware";

const userRouter = express.Router();

const controller = userContainer.container.get<UserController>(TYPES.UserController);
export const middleware = userContainer.container.get<UserMiddleware>(TYPES.UserMiddleware);

userRouter.get(
  "/",
  (req, res, next) => middleware.verifySession(req, res, next),
  controller.onGetUser.bind(controller)
);

userRouter.post("/sign-in", controller.onSignIn.bind(controller));

userRouter.post("/sign-up", controller.onSignUp.bind(controller));

userRouter.delete(
  "/sign-out",
  (req, res, next) => middleware.verifySession(req, res, next),
  controller.onSignOut.bind(controller)
);

export default userRouter;
