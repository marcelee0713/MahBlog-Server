import express from "express";
import * as userContainer from "../config/inversify.config";
import { UserController } from "../controllers/user.controller";
import { TYPES } from "../constants";
import { UserMiddleware } from "../middlewares/user.middleware";
import { updateUserSchema } from "../middlewares/schemas/user.schema";

const userRouter = express.Router();

const controller = userContainer.container.get<UserController>(TYPES.UserController);
export const middleware = userContainer.container.get<UserMiddleware>(TYPES.UserMiddleware);

userRouter
  .route("/")
  .get(
    (req, res, next) => middleware.verifySession(req, res, next),
    controller.onGetUser.bind(controller)
  )
  .delete(
    (req, res, next) => middleware.verifySession(req, res, next),
    controller.onDeleteUser.bind(controller)
  );

userRouter.post("/sign-in", controller.onSignIn.bind(controller));

userRouter.post("/sign-up", controller.onSignUp.bind(controller));

userRouter.delete(
  "/sign-out",
  (req, res, next) => middleware.verifySession(req, res, next),
  controller.onSignOut.bind(controller)
);

userRouter.put(
  "/change-password",
  middleware.validateBody(updateUserSchema),
  (req, res, next) => middleware.verifySession(req, res, next),
  controller.onUpdateUser.bind(controller)
);

userRouter.put(
  "/change-email",
  middleware.validateBody(updateUserSchema),
  (req, res, next) => middleware.verifySession(req, res, next),
  controller.onUpdateUser.bind(controller)
);

userRouter.put(
  "/verify-email",
  middleware.validateBody(updateUserSchema),
  controller.onUpdateUser.bind(controller)
);

export default userRouter;
