import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { IBlogCommentRepliesService } from "../../interfaces/blog/blog.comments.replies.interface";
import { TYPES } from "../../constants";
import { identifyErrors } from "../../utils/error_handler";
import { FormatResponse, FormatResponseArray } from "../../utils/response_handler";
import {
  CreateBlogCommentRepliesBodyReq,
  GetBlogCommentRepliesBodyReq,
  UpdateBlogCommentRepliesBodyReq,
} from "../../types/blog/blog.comment.replies.types";

@injectable()
export class BlogCommentRepliesController {
  private service: IBlogCommentRepliesService;

  constructor(@inject(TYPES.BlogCommentRepliesService) service: IBlogCommentRepliesService) {
    this.service = service;
  }

  async onReply(req: Request, res: Response) {
    try {
      const userId = res.locals.userId as string;
      const body: CreateBlogCommentRepliesBodyReq = {
        body: {
          ...req.body,
          userId: userId,
        },
      };

      const data = await this.service.reply(body.body);

      return res.status(200).json(FormatResponse(data));
    } catch (err) {
      const errObj = identifyErrors(err);

      return res.status(errObj.status).json(errObj);
    }
  }

  async onGetReplies(req: Request, res: Response) {
    try {
      const userId = res.locals.userId as string;
      const body: GetBlogCommentRepliesBodyReq = {
        body: {
          ...req.body,
          userId: userId,
        },
      };

      const data = await this.service.getReplies(body.body);

      return res.status(200).json(FormatResponseArray(data));
    } catch (err) {
      const errObj = identifyErrors(err);

      return res.status(errObj.status).json(errObj);
    }
  }

  async onEditReply(req: Request, res: Response) {
    try {
      const userId = res.locals.userId as string;
      const body: UpdateBlogCommentRepliesBodyReq = {
        body: {
          ...req.body,
          userId: userId,
        },
      };

      const data = await this.service.editReply(body.body);

      return res.status(200).json(FormatResponse(data));
    } catch (err) {
      const errObj = identifyErrors(err);

      return res.status(errObj.status).json(errObj);
    }
  }

  async onRemoveReply(req: Request, res: Response) {
    try {
      const userId = res.locals.userId as string;
      const replyId = req.body.replyId as string;

      await this.service.removeReply(userId, replyId);

      return res.status(200).json(FormatResponse({}));
    } catch (err) {
      const errObj = identifyErrors(err);

      return res.status(errObj.status).json(errObj);
    }
  }

  async onToggleLike(req: Request, res: Response) {
    try {
      const userId = res.locals.userId as string;
      const replyId = req.body.replyId as string;
      const commentId = req.body.commentId as string;

      const type = await this.service.toggleLike(userId, replyId, commentId);

      return res.status(200).json(FormatResponse({}, type));
    } catch (err) {
      const errObj = identifyErrors(err);

      return res.status(errObj.status).json(errObj);
    }
  }
}
