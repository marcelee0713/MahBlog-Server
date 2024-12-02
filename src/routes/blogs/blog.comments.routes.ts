import express from "express";
import { TYPES } from "../../constants";
import * as userContainer from "../../config/inversify.config";
import { middleware } from "../users/user.routes";
import { BlogCommentsController } from "../../controllers/blog/blog.comments.controller";
import {
  createBlogCommentSchema,
  deleteOrLikeBlogCommentSchema,
  getBlogCommentSchema,
  updateBlogCommentSchema,
} from "../../middlewares/schemas/blog/blog.comments.schema";
import {
  createCommentRateLimit,
  updateCommentRateLimit,
  deleteCommentRateLimit,
  getAllCommentRateLimit,
  likeCommentRateLimit,
} from "../../middlewares/rate-limiters/blog/blog.comment.rate_limiter";

const blogCommentsRouter = express.Router();

const controller = userContainer.container.get<BlogCommentsController>(
  TYPES.BlogCommentsController
);

blogCommentsRouter.use((req, res, next) => middleware.verifySession(req, res, next));

blogCommentsRouter
  .route("/")
  .post(
    createCommentRateLimit,
    middleware.validateBody(createBlogCommentSchema),
    controller.onCreateBlogComment.bind(controller)
  )
  .put(
    updateCommentRateLimit,
    middleware.validateBody(updateBlogCommentSchema),
    controller.onUpdateBlogComment.bind(controller)
  )
  .delete(
    deleteCommentRateLimit,
    middleware.validateBody(deleteOrLikeBlogCommentSchema),
    controller.onDeleteBlogComment.bind(controller)
  );

blogCommentsRouter.post(
  "/get-all",
  getAllCommentRateLimit,
  middleware.validateBody(getBlogCommentSchema),
  controller.onGetBlogComments.bind(controller)
);

blogCommentsRouter.post(
  "/like",
  likeCommentRateLimit,
  middleware.validateBody(deleteOrLikeBlogCommentSchema),
  controller.onToggleLike.bind(controller)
);

export default blogCommentsRouter;
