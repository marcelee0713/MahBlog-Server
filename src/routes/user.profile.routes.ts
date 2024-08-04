import express from "express";
import * as userContainer from "../config/inversify.config";
import { TYPES } from "../constants";
import { UserProfileController } from "../controllers/user.profile.controller";
import { middleware } from "./user.routes";
import {
  deleteProfileImageSchema,
  updateProfileBioSchema,
  updateProfileNameSchema,
} from "../middlewares/schemas/user.profile.schema";

const userProfileRouter = express.Router();

const controller = userContainer.container.get<UserProfileController>(TYPES.UserProfileController);

userProfileRouter.use((req, res, next) => middleware.verifySession(req, res, next));

userProfileRouter.get("/", controller.onGetUserProfileData.bind(controller));

userProfileRouter.put(
  "/update-name",
  middleware.validateBody(updateProfileNameSchema),
  controller.onUpdateName.bind(controller)
);

userProfileRouter.put(
  "/update-bio",
  middleware.validateBody(updateProfileBioSchema),
  controller.onUpdateBio.bind(controller)
);

userProfileRouter.put(
  "/update-pic",
  middleware.validateMulter("pfp"),
  controller.onUpdateProfilePicture.bind(controller)
);

userProfileRouter.put(
  "/update-cover",
  middleware.validateMulter("cover"),
  controller.onUpdateCoverPicture.bind(controller)
);

userProfileRouter.delete(
  "/remove-pic",
  middleware.validateBody(deleteProfileImageSchema),
  controller.onRemoveProfilePicture.bind(controller)
);

userProfileRouter.delete(
  "/remove-cover",
  middleware.validateBody(deleteProfileImageSchema),
  controller.onRemoveProfileCover.bind(controller)
);

export default userProfileRouter;
