import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { IBlogCommentRepliesService } from "../../ts/interfaces/blog/blog.comments.replies.interface";
import { TYPES } from "../../constants";
import { identifyErrors } from "../../utils/error_handler";
import { FormatResponse, FormatResponseArray } from "../../utils/response_handler";
import {
  CreateBlogCommentRepliesBodyReq,
  GetBlogCommentRepliesBodyReq,
  UpdateBlogCommentRepliesBodyReq,
} from "../../ts/types/blog/blog.comment.replies.types";
import { IUserNotificationsService } from "../../ts/interfaces/user/user.notifications.interface";
import { safeExecute } from "../../utils";

@injectable()
export class BlogCommentRepliesController {
  private service: IBlogCommentRepliesService;
  private notif: IUserNotificationsService;

  constructor(
    @inject(TYPES.BlogCommentRepliesService) service: IBlogCommentRepliesService,
    @inject(TYPES.UserNotificationsService) notif: IUserNotificationsService
  ) {
    this.service = service;
    this.notif = notif;
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

      if (data.comment.userId !== userId) {
        await safeExecute(this.notif.createNotification.bind(this.notif), {
          type: "REPLIED_COMMENT",
          message: data.reply,
          details: {
            user: {
              receiverId: data.comment.userId,
              senderId: userId,
            },
            referenceIds: {
              blog: data.blogId,
              comment: data.comment.id,
              reply: data.replyId,
            },
          },
        });
      }

      if (data.engagement.repliesTo.userId && data.engagement.repliesTo.userId !== userId) {
        await safeExecute(this.notif.createNotification.bind(this.notif), {
          type: "REPLIED_COMMENT",
          message: data.reply,
          details: {
            user: {
              receiverId: data.engagement.repliesTo.userId,
              senderId: userId,
            },
            referenceIds: {
              blog: data.blogId,
              comment: data.comment.id,
              reply: data.replyId,
            },
          },
        });
      }

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

      const likeInfo = await this.service.toggleLike(userId, replyId, commentId);

      return res.status(200).json(FormatResponse(likeInfo));
    } catch (err) {
      const errObj = identifyErrors(err);

      return res.status(errObj.status).json(errObj);
    }
  }
}
