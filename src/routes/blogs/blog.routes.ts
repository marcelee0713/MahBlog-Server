import express from "express";
import { TYPES } from "../../constants";
import * as userContainer from "../../config/inversify.config";
import { middleware } from "../users/user.routes";
import { BlogController } from "../../controllers/blog/blog.controller";
import { updateBlogSchema } from "../../middlewares/schemas/blog/blog.schema";

const blogRouter = express.Router();

const controller = userContainer.container.get<BlogController>(TYPES.BlogController);

blogRouter.use((req, res, next) => middleware.verifySession(req, res, next));

blogRouter.put(
  "/edit",
  middleware.validateMulter("coverImage"),
  middleware.validateBody(updateBlogSchema),
  controller.onEditBlog.bind(controller)
);

export default blogRouter;
