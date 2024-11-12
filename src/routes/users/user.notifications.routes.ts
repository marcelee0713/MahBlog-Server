import express from "express";
import * as userContainer from "../../config/inversify.config";
import { UserNotificationsController } from "../../controllers/user/user.notifications.controller";
import { TYPES } from "../../constants";
import { middleware } from "./user.routes";
import {
  createNotificationRateLimit,
  deleteNotificationRateLimit,
  getNotificationCountRateLimit,
  getNotificationsRateLimit,
  updateNotificationRateLimit,
} from "../../middlewares/rate-limiters/user/user.notification.rate_limiter";
import {
  createNotificationSchema,
  deleteNotificationSchema,
  getNotificationsSchema,
} from "../../middlewares/schemas/user/user.notifications.schema";

const userNotifRouter = express.Router();

const controller = userContainer.container.get<UserNotificationsController>(
  TYPES.UserNotificationsController
);

userNotifRouter.use((req, res, next) => middleware.verifySession(req, res, next));

userNotifRouter
  .route("/")
  .post(
    createNotificationRateLimit,
    middleware.validateBody(createNotificationSchema),
    controller.onCreateNotification.bind(controller)
  )
  .put(updateNotificationRateLimit, controller.onUpdateNotifications.bind(controller))
  .delete(
    deleteNotificationRateLimit,
    middleware.validateBody(deleteNotificationSchema),
    controller.onDeleteNotification.bind(controller)
  );

userNotifRouter.get(
  "/count",
  getNotificationCountRateLimit,
  controller.onGetNotificationsCount.bind(controller)
);

userNotifRouter.post(
  "/get",
  getNotificationsRateLimit,
  middleware.validateBody(getNotificationsSchema),
  controller.onGetNotifications.bind(controller)
);

export default userNotifRouter;
