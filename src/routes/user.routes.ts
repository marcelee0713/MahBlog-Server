import express from "express";
import * as userContainer from "../config/inversify.config";
import { UserController } from "../controllers/user.controller";
import { TYPES } from "../constants";
import { UserMiddleware } from "../middlewares/user.middleware";
import {
  emailVerificationReqSchema,
  getUserByEmailSchema,
  resetPasswordReqSchema,
  tokenSchema,
  updateUserSchema,
} from "../middlewares/schemas/user.schema";
import {
  createUserRateLimit,
  deleteUserRateLimit,
  emailAndPassReqRateLimit,
  getUserRateLimit,
  signInAndOutRateLimit,
  updateUserRateLimit,
} from "../middlewares/rate-limiters/user/user.rate_limiter";

const userRouter = express.Router();

const controller = userContainer.container.get<UserController>(TYPES.UserController);
export const middleware = userContainer.container.get<UserMiddleware>(TYPES.UserMiddleware);

userRouter
  .route("/")
  .get(
    getUserRateLimit,
    (req, res, next) => middleware.verifySession(req, res, next),
    controller.onGetUser.bind(controller)
  )
  .delete(
    deleteUserRateLimit,
    (req, res, next) => middleware.verifySession(req, res, next),
    controller.onDeleteUser.bind(controller)
  );

userRouter.post("/sign-in", signInAndOutRateLimit, controller.onSignIn.bind(controller));

userRouter.post("/sign-up", createUserRateLimit, controller.onSignUp.bind(controller));

userRouter.delete(
  "/sign-out",
  signInAndOutRateLimit,
  (req, res, next) => middleware.verifySession(req, res, next),
  controller.onSignOut.bind(controller)
);

userRouter.put(
  "/change-password",
  updateUserRateLimit,
  middleware.validateBody(updateUserSchema),
  (req, res, next) => middleware.verifySession(req, res, next),
  controller.onUpdateUser.bind(controller)
);

userRouter.post(
  "/get-user-by-email",
  getUserRateLimit,
  middleware.validateBody(getUserByEmailSchema),
  controller.onGetUserByEmail.bind(controller)
);

userRouter.post(
  "/req-change-email",
  updateUserRateLimit,
  middleware.validateBody(updateUserSchema),
  (req, res, next) => middleware.verifySession(req, res, next),
  controller.onUpdateUser.bind(controller)
);

userRouter.post(
  "/req-email-verification",
  emailAndPassReqRateLimit,
  middleware.validateBody(emailVerificationReqSchema),
  controller.onGetUserByEmail.bind(controller)
);

userRouter.post(
  "/req-reset-password",
  emailAndPassReqRateLimit,
  middleware.validateBody(resetPasswordReqSchema),
  controller.onResetPasswordReq.bind(controller)
);

userRouter.put(
  "/verify-email",
  updateUserRateLimit,
  middleware.validateBody(updateUserSchema),
  controller.onUpdateUser.bind(controller)
);

userRouter.put(
  "/reset-password",
  updateUserRateLimit,
  middleware.validateBody(updateUserSchema),
  controller.onUpdateUser.bind(controller)
);

userRouter.put(
  "/change-email",
  updateUserRateLimit,
  middleware.validateBody(tokenSchema),
  (req, res, next) => middleware.verifySession(req, res, next),
  controller.onEmailChange.bind(controller)
);

export default userRouter;
