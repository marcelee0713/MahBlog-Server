import express from "express";
import * as userContainer from "../../config/inversify.config";
import { UserController } from "../../controllers/user/user.controller";
import { TYPES } from "../../constants";
import { UserMiddleware } from "../../middlewares/user.middleware";
import {
  deviceVerificationReqSchema,
  emailVerificationReqSchema,
  resetPasswordReqSchema,
  tokenSchema,
  updateUserSchema,
} from "../../middlewares/schemas/user/user.schema";
import {
  createUserRateLimit,
  deleteUserRateLimit,
  emailAndPassReqRateLimit,
  getUserRateLimit,
  signInAndOutRateLimit,
  updateUserRateLimit,
} from "../../middlewares/rate-limiters/user/user.rate_limiter";
import passport from "passport";
import { PassportService } from "../../middlewares/passport.middleware";
import { UserDevicesController } from "../../controllers/user/user.devices.controller";

const userRouter = express.Router();

const controller = userContainer.container.get<UserController>(TYPES.UserController);
export const middleware = userContainer.container.get<UserMiddleware>(TYPES.UserMiddleware);

const passportService = userContainer.container.get<PassportService>(TYPES.PassportService);
const userDeviceController = userContainer.container.get<UserDevicesController>(
  TYPES.UserDevicesController
);

passportService.initializeGoogleStrategy();

userRouter.get(
  "/google",
  (req, res, next) => middleware.validateCurrentSession(req, res, next),
  passport.authenticate("google", { scope: ["profile", "email"], session: false })
);

userRouter.get(
  "/google/callback",
  (req, res, next) => middleware.handleGoogleCallback(req, res, next),
  passport.authenticate("google", { session: false }),
  controller.OnSignInPasswordLess.bind(controller)
);

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

userRouter.post(
  "/verify-device",
  updateUserRateLimit,
  middleware.validateBody(deviceVerificationReqSchema),
  userDeviceController.onSubmitVerification.bind(userDeviceController)
);

userRouter.post(
  "/verify-device-oauth",
  updateUserRateLimit,
  (req, res, next) => middleware.verifySession(req, res, next),
  userDeviceController.OAuthStoreDeviceID.bind(userDeviceController)
);

export default userRouter;
