import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { IUserConnectionsService } from "../../ts/interfaces/user/user.connections.interface";
import { TYPES } from "../../constants";
import { CustomError, identifyErrors } from "../../utils/error_handler";
import { FormatResponse, FormatResponseArray } from "../../utils/response_handler";
import {
  GetUserConnectionsReqBody,
  GetUserPendingConnectionsReqBody,
  UpdateUserConnectionReqBody,
} from "../../ts/types/user/user.connections.types";
import { IUserNotificationsService } from "../../ts/interfaces/user/user.notifications.interface";

@injectable()
export class UserConnectionsController {
  private notif: IUserNotificationsService;
  private service: IUserConnectionsService;

  constructor(
    @inject(TYPES.UserConnectionsService) service: IUserConnectionsService,
    @inject(TYPES.UserNotificationsService) notif: IUserNotificationsService
  ) {
    this.service = service;
    this.notif = notif;
  }

  async onCreateConnection(req: Request, res: Response) {
    try {
      const sourceUserId = res.locals.userId as string;
      const targetUserId = req.body.targetUserId as string;

      await this.service.createConnection(sourceUserId, targetUserId);

      return res.status(200).json(FormatResponse({}, "Created a request connection"));
    } catch (err) {
      const errObj = identifyErrors(err);

      return res.status(errObj.status).json(errObj);
    }
  }

  async onGetTotalConnections(req: Request, res: Response) {
    try {
      const body: GetUserConnectionsReqBody = {
        body: {
          ...req.body,
          userId: res.locals.userId as string,
        },
      };

      const data = await this.service.getTotalConnections(body.body);

      return res
        .status(200)
        .json(FormatResponseArray(data, "Fetched the total user's connections"));
    } catch (err) {
      const errObj = identifyErrors(err);

      return res.status(errObj.status).json(errObj);
    }
  }

  async onGetTotalConnectionsCount(req: Request, res: Response) {
    try {
      const userId = res.locals.userId as string;

      const data = await this.service.getTotalConnectionsCount(userId);

      return res
        .status(200)
        .json(FormatResponse(data, "Fetched the total user's connections count"));
    } catch (err) {
      const errObj = identifyErrors(err);

      return res.status(errObj.status).json(errObj);
    }
  }

  async onGetPendingConnections(req: Request, res: Response) {
    try {
      const body: GetUserPendingConnectionsReqBody = {
        body: {
          ...req.body,
          userId: res.locals.userId as string,
        },
      };

      const data = await this.service.getPendingConnections(body.body);

      return res
        .status(200)
        .json(FormatResponseArray(data, "Fetched the total user's pending connections"));
    } catch (err) {
      const errObj = identifyErrors(err);

      return res.status(errObj.status).json(errObj);
    }
  }

  async onUpdateConnections(req: Request, res: Response) {
    try {
      const data: UpdateUserConnectionReqBody = {
        body: {
          ...req.body,
          targetUserId: res.locals.userId as string,
        },
      };

      switch (data.body.status) {
        case "ACCEPTED": {
          await this.service.updateConnection({
            ...data.body,
            status: "ACCEPTED",
          });

          await this.notif.createNotification({
            type: "ACCEPTED_CONNECTION_STATUS",
            details: {
              user: {
                receiverId: data.body.sourceUserId,
                senderId: data.body.targetUserId,
              },
            },
          });

          break;
        }

        case "REJECTED": {
          await this.service.updateConnection({
            ...data.body,
            status: "REJECTED",
          });

          await this.notif.createNotification({
            type: "REJECTED_CONNECTION_STATUS",
            details: {
              user: {
                receiverId: data.body.sourceUserId,
                senderId: data.body.targetUserId,
              },
            },
          });

          break;
        }

        case "BLOCKED": {
          await this.service.updateConnection({
            ...data.body,
            status: "BLOCKED",
          });

          break;
        }

        case "PENDING": {
          return res.status(204).json(FormatResponse({}, "This use case has no utilization."));
        }

        default:
          throw new CustomError("does-not-exist", "Use case does not exist.");
      }

      return res.status(200).json(FormatResponse({}, `Use case used: ${data.body.status}`));
    } catch (err) {
      const errObj = identifyErrors(err);

      return res.status(errObj.status).json(errObj);
    }
  }
}
