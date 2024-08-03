import express from "express";
import { UserConnectionsController } from "../controllers/user.connections.controller";
import * as userContainer from "../config/inversify.config";
import { TYPES } from "../constants";
import { middleware } from "./user.routes";
import {
  createUserConnectionsSchema,
  getUserPendingConnectionsSchema,
  getUserTotalConnectionsSchema,
  onUpdateUserConnectionsSchema,
} from "../middlewares/schemas/user.connections.schema";

const userConnectionsRouter = express.Router();

const controller = userContainer.container.get<UserConnectionsController>(
  TYPES.UserConnectionsController
);

userConnectionsRouter.use((req, res, next) => middleware.verifySession(req, res, next));

userConnectionsRouter
  .route("/")
  .post(
    middleware.validateBody(createUserConnectionsSchema),
    controller.onCreateConnection.bind(controller)
  )
  .put(
    middleware.validateBody(onUpdateUserConnectionsSchema),
    controller.onUpdateConnections.bind(controller)
  );

userConnectionsRouter.post(
  "/get-connections",
  middleware.validateBody(getUserTotalConnectionsSchema),
  controller.onGetTotalConnections.bind(controller)
);

userConnectionsRouter.post(
  "/get-connections-count",
  controller.onGetTotalConnectionsCount.bind(controller)
);

userConnectionsRouter.post(
  "/get-pending-connections",
  middleware.validateBody(getUserPendingConnectionsSchema),
  controller.onGetPendingConnections.bind(controller)
);

export default userConnectionsRouter;
