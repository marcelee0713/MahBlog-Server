import express from "express";
import { TYPES } from "../../constants";
import * as userContainer from "../../config/inversify.config";
import { middleware } from "../users/user.routes";
import { BlogCommentRepliesController } from "../../controllers/blog/blog.comment.replies.controller";
import {
  createCommentReplySchema,
  getCommentRepliesSchema,
  updateCommentReplySchema,
  deleteCommentReplySchema,
  likeReplySchema,
} from "../../middlewares/schemas/blog/blog.comment.replies.schema";
import {
  createReplyRateLimit,
  deleteReplyRateLimit,
  getAllReplyRateLimit,
  likeReplyRateLimit,
  updateReplyRateLimit,
} from "../../middlewares/rate-limiters/blog/blog.reply.rate_limiter";

const blogCommentRepliesRouter = express.Router();

const controller = userContainer.container.get<BlogCommentRepliesController>(
  TYPES.BlogCommentRepliesController
);

blogCommentRepliesRouter.use((req, res, next) => middleware.verifySession(req, res, next));

blogCommentRepliesRouter
  .route("/")
  .post(
    createReplyRateLimit,
    middleware.validateBody(createCommentReplySchema),
    controller.onReply.bind(controller)
  )
  .put(
    updateReplyRateLimit,
    middleware.validateBody(updateCommentReplySchema),
    controller.onEditReply.bind(controller)
  )
  .delete(
    deleteReplyRateLimit,
    middleware.validateBody(deleteCommentReplySchema),
    controller.onRemoveReply.bind(controller)
  );

blogCommentRepliesRouter.post(
  "/get-all",
  getAllReplyRateLimit,
  middleware.validateBody(getCommentRepliesSchema),
  controller.onGetReplies.bind(controller)
);

blogCommentRepliesRouter.post(
  "/like",
  likeReplyRateLimit,
  middleware.validateBody(likeReplySchema),
  controller.onToggleLike.bind(controller)
);

export default blogCommentRepliesRouter;
