import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { IUserNotificationsService } from "../../interfaces/user/user.notifications.interface";
import { TYPES } from "../../constants";
import { identifyErrors } from "../../utils/error_handler";
import {
  CreateNotificationReqBody,
  GetNotificationReqBody,
} from "../../types/user/user.notifications.type";
import { FormatResponse, FormatResponseArray } from "../../utils/response_handler";

// TODO: Make this part admin protected.
@injectable()
export class UserNotificationsController {
  private service: IUserNotificationsService;

  constructor(@inject(TYPES.UserNotificationsService) service: IUserNotificationsService) {
    this.service = service;
  }

  async onCreateNotification(req: Request, res: Response) {
    try {
      const data: CreateNotificationReqBody = {
        body: {
          ...req.body,
        },
      };

      data.body.details.user.senderId = res.locals.userId as string;

      await this.service.createNotification(data.body);

      return res
        .status(200)
        .json(FormatResponse({}, `Created a notification with the type: ${data.body.type}`));
    } catch (err) {
      const errObj = identifyErrors(err);

      return res.status(errObj.status).json(errObj);
    }
  }

  async onGetNotifications(req: Request, res: Response) {
    try {
      const data: GetNotificationReqBody = {
        body: {
          ...req.body,
          userId: res.locals.userId as string,
        },
      };

      const notifications = await this.service.getNotifications(data.body);

      return res.status(200).json(FormatResponseArray(notifications));
    } catch (err) {
      const errObj = identifyErrors(err);

      return res.status(errObj.status).json(errObj);
    }
  }

  async onUpdateNotifications(req: Request, res: Response) {
    try {
      const userId = res.locals.userId as string;

      await this.service.updateNotifications(userId);

      return res.status(200).json(FormatResponse({}));
    } catch (err) {
      const errObj = identifyErrors(err);

      return res.status(errObj.status).json(errObj);
    }
  }

  async onGetNotificationsCount(req: Request, res: Response) {
    try {
      const userId = res.locals.userId as string;

      const count = await this.service.getNotificationsCount(userId);

      return res.status(200).json(FormatResponse({ count }));
    } catch (err) {
      const errObj = identifyErrors(err);

      return res.status(errObj.status).json(errObj);
    }
  }

  async onDeleteNotification(req: Request, res: Response) {
    try {
      const userId = res.locals.userId as string;
      const notificationId = req.body.notificationId as string;

      await this.service.deleteNotification(userId, notificationId);

      return res.status(200).json(FormatResponse({}));
    } catch (err) {
      const errObj = identifyErrors(err);

      return res.status(errObj.status).json(errObj);
    }
  }
}
