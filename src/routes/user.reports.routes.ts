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
  getReportsSchema,
  getReportSchema,
} from "../middlewares/schemas/user.reports.schema";
import {
  getReportRateLimit,
  getReportsRateLimit,
  createReportRateLimit,
  deleteReportsRateLimit,
  deleteReportRateLimit,
} from "../middlewares/rate-limiters/user/user.reports.rate_limiter";

const userReportsRouter = express.Router();

const controller = userContainer.container.get<UserReportsController>(TYPES.UserReportsController);

userReportsRouter.use((req, res, next) => middleware.verifySession(req, res, next));

userReportsRouter.post(
  "/get",
  getReportRateLimit,
  middleware.validateBody(getReportSchema),
  controller.onGetReport.bind(controller)
);

userReportsRouter.post(
  "/get-all",
  getReportsRateLimit,
  middleware.validateBody(getReportsSchema),
  controller.onGetAllReports.bind(controller)
);

userReportsRouter.post(
  "/report-issue",
  createReportRateLimit,
  middleware.validateBody(createReportIssueSchema),
  controller.onReportIssue.bind(controller)
);

userReportsRouter.post(
  "/report-user",
  createReportRateLimit,
  middleware.validateBody(createReportUserSchema),
  controller.onReportUser.bind(controller)
);

userReportsRouter.post(
  "/report-blog",
  createReportRateLimit,
  middleware.validateBody(createReportBlogSchema),
  controller.onReportBlog.bind(controller)
);

userReportsRouter.post(
  "/report-comment",
  createReportRateLimit,
  middleware.validateBody(createReportCommentSchema),
  controller.onReportComment.bind(controller)
);

userReportsRouter.post(
  "/report-reply",
  createReportRateLimit,
  middleware.validateBody(createReportReplySchema),
  controller.onReportReply.bind(controller)
);

userReportsRouter.delete(
  "/remove-all-user-reports",
  deleteReportsRateLimit,
  controller.onDeleteAllReports.bind(controller)
);

userReportsRouter.delete(
  "/remove-user-reports",
  deleteReportsRateLimit,
  middleware.validateBody(deleteReportsSchema),
  controller.onDeleteUserReports.bind(controller)
);

userReportsRouter.delete(
  "/remove-report",
  deleteReportRateLimit,
  middleware.validateBody(deleteReportSchema),
  controller.onDeleteReport.bind(controller)
);

export default userReportsRouter;
