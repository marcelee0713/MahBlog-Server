import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { IUserNotificationsService } from "../../ts/interfaces/user/user.notifications.interface";
import { TYPES } from "../../constants";
import { CustomError, identifyErrors } from "../../utils/error_handler";
import {
  CreateNotificationReqBody,
  GetNotificationReqBody,
} from "../../ts/types/user/user.notifications.type";
import { FormatResponse, FormatResponseArray } from "../../utils/response_handler";
import { IUserService } from "../../ts/interfaces/user/user.interface";

@injectable()
export class UserNotificationsController {
  private service: IUserNotificationsService;
  private userService: IUserService;

  constructor(
    @inject(TYPES.UserNotificationsService) service: IUserNotificationsService,
    @inject(TYPES.UserService) userService: IUserService
  ) {
    this.service = service;
    this.userService = userService;
  }

  async onCreateNotification(req: Request, res: Response) {
    try {
      const data: CreateNotificationReqBody = {
        body: {
          ...req.body,
        },
      };

      const userId = res.locals.userId as string;

      data.body.details.user.senderId = userId;

      const user = await this.userService.getUser(userId);

      if (user.role !== "ADMIN") throw new CustomError("user-not-authorized");

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
