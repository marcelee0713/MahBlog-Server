import express from "express";
import * as userContainer from "../../config/inversify.config";
import { TYPES } from "../../constants";
import { UserProfileController } from "../../controllers/user/user.profile.controller";
import { middleware } from "./user.routes";
import {
  deleteProfileImageSchema,
  updateProfileBioSchema,
  updateProfileNameSchema,
} from "../../middlewares/schemas/user/user.profile.schema";
import {
  getProfileRateLimit,
  updateProfileRateLimit,
  removeProfileRateLimit,
} from "../../middlewares/rate-limiters/user/user.profile.rate_limiter";

const userProfileRouter = express.Router();

const controller = userContainer.container.get<UserProfileController>(TYPES.UserProfileController);

userProfileRouter.use((req, res, next) => middleware.verifySession(req, res, next));

userProfileRouter.get("/", getProfileRateLimit, controller.onGetUserProfileData.bind(controller));

userProfileRouter.put(
  "/update-name",
  updateProfileRateLimit,
  middleware.validateBody(updateProfileNameSchema),
  controller.onUpdateName.bind(controller)
);

userProfileRouter.put(
  "/update-bio",
  updateProfileRateLimit,
  middleware.validateBody(updateProfileBioSchema),
  controller.onUpdateBio.bind(controller)
);

userProfileRouter.put(
  "/update-pic",
  updateProfileRateLimit,
  middleware.validateMulter("pfp"),
  controller.onUpdateProfilePicture.bind(controller)
);

userProfileRouter.put(
  "/update-cover",
  updateProfileRateLimit,
  middleware.validateMulter("cover"),
  controller.onUpdateCoverPicture.bind(controller)
);

userProfileRouter.delete(
  "/remove-pic",
  removeProfileRateLimit,
  middleware.validateBody(deleteProfileImageSchema),
  controller.onRemoveProfilePicture.bind(controller)
);

userProfileRouter.delete(
  "/remove-cover",
  removeProfileRateLimit,
  middleware.validateBody(deleteProfileImageSchema),
  controller.onRemoveProfileCover.bind(controller)
);

export default userProfileRouter;
