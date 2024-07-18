import express from "express";
import * as userContainer from "../config/inversify.config";
import { TYPES } from "../constants";
import { UserProfileController } from "../controllers/user.profile.controller";
import { middleware } from "./user.routes";
import {
  removeProfileImageSchema,
  updateProfileBioSchema,
  updateProfileNameSchema,
} from "../middlewares/schemas/user.profile.schema";
import { upload } from "../config/multer";

const userProfileRouter = express.Router();

const controller = userContainer.container.get<UserProfileController>(TYPES.UserProfileController);

userProfileRouter.get(
  "/",
  (req, res, next) => middleware.verifySession(req, res, next),
  controller.onGetUserProfileData.bind(controller)
);

userProfileRouter.put(
  "/update-name",
  middleware.validateBody(updateProfileNameSchema),
  (req, res, next) => middleware.verifySession(req, res, next),
  controller.onUpdateName.bind(controller)
);

userProfileRouter.put(
  "/update-bio",
  middleware.validateBody(updateProfileBioSchema),
  (req, res, next) => middleware.verifySession(req, res, next),
  controller.onUpdateBio.bind(controller)
);

userProfileRouter.put(
  "/update-pic",
  middleware.validateMulter("pfp"),
  (req, res, next) => middleware.verifySession(req, res, next),
  controller.onUpdateProfilePicture.bind(controller)
);

userProfileRouter.put(
  "/update-cover",
  middleware.validateMulter("cover"),
  (req, res, next) => middleware.verifySession(req, res, next),
  controller.onUpdateCoverPicture.bind(controller)
);

userProfileRouter.delete(
  "/remove-pic",
  middleware.validateBody(removeProfileImageSchema),
  (req, res, next) => middleware.verifySession(req, res, next),
  controller.onRemoveProfilePicture.bind(controller)
);

userProfileRouter.delete(
  "/remove-cover",
  middleware.validateBody(removeProfileImageSchema),
  (req, res, next) => middleware.verifySession(req, res, next),
  controller.onRemoveProfileCover.bind(controller)
);

export default userProfileRouter;
