import express from "express";
import { TYPES } from "../../constants";
import * as userContainer from "../../config/inversify.config";
import { middleware } from "../users/user.routes";
import { BlogController } from "../../controllers/blog/blog.controller";
import {
  getBlogSchema,
  getBlogsSchema,
  likeBlogSchema,
  updateBlogSchema,
} from "../../middlewares/schemas/blog/blog.schema";

const blogRouter = express.Router();

const controller = userContainer.container.get<BlogController>(TYPES.BlogController);

blogRouter.use((req, res, next) => middleware.verifySession(req, res, next));

blogRouter
  .route("/")
  .post(controller.onCreateBlog.bind(controller))
  .put(
    middleware.validateMulter("coverImage"),
    middleware.validateBody(updateBlogSchema),
    controller.onEditBlog.bind(controller)
  )
  .delete(controller.onDeleteBlog.bind(controller));

blogRouter.post(
  "/get-all",
  middleware.validateBody(getBlogsSchema),
  controller.onGetBlogs.bind(controller)
);

blogRouter.post(
  "/get",
  middleware.validateBody(getBlogSchema),
  controller.onGetBlog.bind(controller)
);

blogRouter.post(
  "/like",
  middleware.validateBody(likeBlogSchema),
  controller.onToggleLike.bind(controller)
);

export default blogRouter;
