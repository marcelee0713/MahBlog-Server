import express from "express";
import { TYPES } from "../../constants";
import * as userContainer from "../../config/inversify.config";
import { middleware } from "../users/user.routes";
import { BlogCommentsController } from "../../controllers/blog/blog.comments.controller";
import {
  createBlogCommentSchema,
  deleteBlogCommentSchema,
  getBlogCommentSchema,
  updateBlogCommentSchema,
} from "../../middlewares/schemas/blog/blog.comments.schema";

const blogCommentsRouter = express.Router();

const controller = userContainer.container.get<BlogCommentsController>(
  TYPES.BlogCommentsController
);

blogCommentsRouter.use((req, res, next) => middleware.verifySession(req, res, next));

blogCommentsRouter
  .route("/")
  .post(
    middleware.validateBody(createBlogCommentSchema),
    controller.onCreateBlogComment.bind(controller)
  )
  .put(
    middleware.validateBody(updateBlogCommentSchema),
    controller.onUpdateBlogComment.bind(controller)
  )
  .delete(
    middleware.validateBody(deleteBlogCommentSchema),
    controller.onDeleteBlogComment.bind(controller)
  );

blogCommentsRouter.post(
  "/get-all",
  middleware.validateBody(getBlogCommentSchema),
  controller.onGetBlogComments.bind(controller)
);

export default blogCommentsRouter;
