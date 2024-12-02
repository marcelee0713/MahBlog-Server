import express from "express";
import { TYPES } from "../../constants";
import * as userContainer from "../../config/inversify.config";
import { middleware } from "../users/user.routes";
import { BlogContentsController } from "../../controllers/blog/blog.contents.controller";
import {
  createAndGetBlogContentSchema,
  deleteBlogContentSchema,
  updateBlogContentSchema,
} from "../../middlewares/schemas/blog/blog.contents.schema";
import {
  createBlogContentRateLimit,
  updateBlogContentRateLimit,
  deleteBlogContentRateLimit,
  getAllBlogContentRateLimit,
} from "../../middlewares/rate-limiters/blog/blog.content.rate_limiter";

const blogContentsRouter = express.Router();

const controller = userContainer.container.get<BlogContentsController>(
  TYPES.BlogContentsController
);

blogContentsRouter.use((req, res, next) => middleware.verifySession(req, res, next));

blogContentsRouter
  .route("/")
  .post(
    createBlogContentRateLimit,
    middleware.validateBody(createAndGetBlogContentSchema),
    controller.onCreateBlogContent.bind(controller)
  )
  .put(
    updateBlogContentRateLimit,
    middleware.validateMulter("contentImage"),
    middleware.validateBody(updateBlogContentSchema),
    controller.onUpdateBlogContents.bind(controller)
  )
  .delete(
    deleteBlogContentRateLimit,
    middleware.validateBody(deleteBlogContentSchema),
    controller.onDeleteContent.bind(controller)
  );

blogContentsRouter.post(
  "/get-all",
  getAllBlogContentRateLimit,
  middleware.validateBody(createAndGetBlogContentSchema),
  controller.onGetBlogContents.bind(controller)
);

export default blogContentsRouter;
