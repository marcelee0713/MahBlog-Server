import express from "express";
import * as userContainer from "../config/inversify.config";
import { TYPES } from "../constants";
import { UserReportsController } from "../controllers/user.reports.controller";
import { middleware } from "./user.routes";
import {
  createReportBlogSchema,
  createReportCommentSchema,
  createReportIssueSchema,
  createReportReplySchema,
  createReportUserSchema,
  deleteReportSchema,
  deleteReportsSchema,
  getAllReportsSchema,
  getReportSchema,
} from "../middlewares/schemas/user.reports.schema";

const userReportsRouter = express.Router();

const controller = userContainer.container.get<UserReportsController>(TYPES.UserReportsController);

userReportsRouter.use((req, res, next) => middleware.verifySession(req, res, next));

userReportsRouter.post(
  "/get",
  middleware.validateBody(getReportSchema),
  controller.onGetReport.bind(controller)
);

userReportsRouter.post(
  "/get-all",
  middleware.validateBody(getAllReportsSchema),
  controller.onGetAllReports.bind(controller)
);

userReportsRouter.post(
  "/report-issue",
  middleware.validateBody(createReportIssueSchema),
  controller.onReportIssue.bind(controller)
);

userReportsRouter.post(
  "/report-user",
  middleware.validateBody(createReportUserSchema),
  controller.onReportUser.bind(controller)
);

userReportsRouter.post(
  "/report-blog",
  middleware.validateBody(createReportBlogSchema),
  controller.onReportBlog.bind(controller)
);

userReportsRouter.post(
  "/report-comment",
  middleware.validateBody(createReportCommentSchema),
  controller.onReportComment.bind(controller)
);

userReportsRouter.post(
  "/report-reply",
  middleware.validateBody(createReportReplySchema),
  controller.onReportReply.bind(controller)
);

userReportsRouter.delete(
  "/remove-all-user-reports",
  controller.onDeleteAllReports.bind(controller)
);

userReportsRouter.delete(
  "/remove-user-reports",
  middleware.validateBody(deleteReportsSchema),
  controller.onDeleteUserReports.bind(controller)
);

userReportsRouter.delete(
  "/remove-report",
  middleware.validateBody(deleteReportSchema),
  controller.onDeleteReport.bind(controller)
);

export default userReportsRouter;
