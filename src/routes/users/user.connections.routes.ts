import express from "express";
import { UserConnectionsController } from "../../controllers/user/user.connections.controller";
import * as userContainer from "../../config/inversify.config";
import { TYPES } from "../../constants";
import { middleware } from "./user.routes";
import {
  createUserConnectionsSchema,
  getUserPendingConnectionsSchema,
  getUserConnectionsSchema,
  onUpdateUserConnectionsSchema,
} from "../../middlewares/schemas/user/user.connections.schema";
import {
  createConnectionsRateLimit,
  updateConnectionsRateLimit,
  getConnectionsRateLimit,
} from "../../middlewares/rate-limiters/user/user.connection.rate_limiter";

const userConnectionsRouter = express.Router();

const controller = userContainer.container.get<UserConnectionsController>(
  TYPES.UserConnectionsController
);

userConnectionsRouter.use((req, res, next) => middleware.verifySession(req, res, next));

userConnectionsRouter
  .route("/")
  .post(
    createConnectionsRateLimit,
    middleware.validateBody(createUserConnectionsSchema),
    controller.onCreateConnection.bind(controller)
  )
  .put(
    updateConnectionsRateLimit,
    middleware.validateBody(onUpdateUserConnectionsSchema),
    controller.onUpdateConnections.bind(controller)
  );

userConnectionsRouter.post(
  "/get-connections",
  getConnectionsRateLimit,
  middleware.validateBody(getUserConnectionsSchema),
  controller.onGetTotalConnections.bind(controller)
);

userConnectionsRouter.post(
  "/get-connections-count",
  getConnectionsRateLimit,
  controller.onGetTotalConnectionsCount.bind(controller)
);

userConnectionsRouter.post(
  "/get-pending-connections",
  getConnectionsRateLimit,
  middleware.validateBody(getUserPendingConnectionsSchema),
  controller.onGetPendingConnections.bind(controller)
);

export default userConnectionsRouter;
