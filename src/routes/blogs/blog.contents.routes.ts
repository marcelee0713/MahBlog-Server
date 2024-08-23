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

const blogContentsRouter = express.Router();

const controller = userContainer.container.get<BlogContentsController>(
  TYPES.BlogContentsController
);

blogContentsRouter.use((req, res, next) => middleware.verifySession(req, res, next));

blogContentsRouter
  .route("/")
  .post(
    middleware.validateBody(createAndGetBlogContentSchema),
    controller.onCreateBlogContent.bind(controller)
  )
  .get(
    middleware.validateBody(createAndGetBlogContentSchema),
    controller.onGetBlogContents.bind(controller)
  )
  .put(
    middleware.validateMulter("contentImage"),
    middleware.validateBody(updateBlogContentSchema),
    controller.onUpdateBlogContents.bind(controller)
  )
  .delete(
    middleware.validateBody(deleteBlogContentSchema),
    controller.onDeleteContent.bind(controller)
  );

export default blogContentsRouter;
