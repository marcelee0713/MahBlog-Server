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
import {
  createBlogRateLimit,
  deleteBlogRateLimit,
  getAllBlogRateLimit,
  getBlogRateLimit,
  likeBlogRateLimit,
  updateBlogRateLimit,
} from "../../middlewares/rate-limiters/blog/blog.rate_limiter";

const blogRouter = express.Router();

const controller = userContainer.container.get<BlogController>(TYPES.BlogController);

blogRouter.use((req, res, next) => middleware.verifySession(req, res, next));

blogRouter
  .route("/")
  .post(createBlogRateLimit, controller.onCreateBlog.bind(controller))
  .put(
    updateBlogRateLimit,
    middleware.validateMulter("coverImage"),
    middleware.validateBody(updateBlogSchema),
    controller.onEditBlog.bind(controller)
  )
  .delete(deleteBlogRateLimit, controller.onDeleteBlog.bind(controller));

blogRouter.post(
  "/get-all",
  getAllBlogRateLimit,
  middleware.validateBody(getBlogsSchema),
  controller.onGetBlogs.bind(controller)
);

blogRouter.post(
  "/get",
  getBlogRateLimit,
  middleware.validateBody(getBlogSchema),
  controller.onGetBlog.bind(controller)
);

blogRouter.post(
  "/like",
  likeBlogRateLimit,
  middleware.validateBody(likeBlogSchema),
  controller.onToggleLike.bind(controller)
);

export default blogRouter;
