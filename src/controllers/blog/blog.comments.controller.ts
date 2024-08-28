import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { IBlogCommentsService } from "../../interfaces/blog/blog.comments.interface";
import { TYPES } from "../../constants";
import { identifyErrors } from "../../utils/error_handler";
import { FormatResponse, FormatResponseArray } from "../../utils/response_handler";
import { GetBlogCommentsBodyReq } from "../../types/blog/blog.comments.types";

@injectable()
export class BlogCommentsController {
  private service: IBlogCommentsService;

  constructor(@inject(TYPES.BlogCommentsService) service: IBlogCommentsService) {
    this.service = service;
  }

  async onCreateBlogComment(req: Request, res: Response) {
    try {
      const userId = res.locals.userId as string;
      const blogId = req.body.blogId as string;
      const comment = req.body.comment as string;

      const data = await this.service.createBlogComment({ userId, blogId, comment });

      return res.status(200).json(FormatResponse(data));
    } catch (err) {
      const errObj = identifyErrors(err);

      return res.status(errObj.status).json(errObj);
    }
  }

  async onGetBlogComments(req: Request, res: Response) {
    try {
      const userId = res.locals.userId as string;
      const body: GetBlogCommentsBodyReq = {
        body: {
          ...req.body,
          userId: userId,
        },
      };

      const comments = await this.service.getBlogComments(body.body);

      return res.status(200).json(FormatResponseArray(comments));
    } catch (err) {
      const errObj = identifyErrors(err);

      return res.status(errObj.status).json(errObj);
    }
  }

  async onUpdateBlogComment(req: Request, res: Response) {
    try {
      const userId = res.locals.userId as string;
      const commentId = req.body.commentId as string;
      const newComment = req.body.newComment as string;

      const data = await this.service.updateBlogComment({ userId, commentId, newComment });

      return res.status(200).json(FormatResponse(data));
    } catch (err) {
      const errObj = identifyErrors(err);

      return res.status(errObj.status).json(errObj);
    }
  }

  async onDeleteBlogComment(req: Request, res: Response) {
    try {
      const userId = res.locals.userId as string;
      const commentId = req.body.commentId as string;

      const data = await this.service.deleteBlogComment(userId, commentId);

      return res.status(200).json(FormatResponse(data));
    } catch (err) {
      const errObj = identifyErrors(err);

      return res.status(errObj.status).json(errObj);
    }
  }

  async onToggleLike(req: Request, res: Response) {
    try {
      const userId = res.locals.userId as string;
      const commentId = req.body.commentId as string;

      const type = await this.service.toggleLike(userId, commentId);

      return res.status(200).json(FormatResponse({}, type));
    } catch (err) {
      const errObj = identifyErrors(err);

      return res.status(errObj.status).json(errObj);
    }
  }
}
