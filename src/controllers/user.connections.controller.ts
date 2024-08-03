import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { IUserConnectionsService } from "../interfaces/user/user.connections.interface";
import { TYPES } from "../constants";
import { CustomError, identifyErrors } from "../utils/error_handler";
import { FormatResponse, FormatResponseArray } from "../utils/response_handler";
import { SortOrder } from "../types";
import { UserConnectionUpdateReqBody } from "../types/user/user.connections.types";

@injectable()
export class UserConnectionsController {
  private service: IUserConnectionsService;

  constructor(@inject(TYPES.UserConnectionsService) service: IUserConnectionsService) {
    this.service = service;
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
      const userId = res.locals.userId as string;

      const searchNameInput = req.body.searchNameInput as string | undefined;

      const data = await this.service.getTotalConnections(userId, searchNameInput);

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
      const userId = res.locals.userId as string;
      const dateOrder = req.body.dateOrder as SortOrder;

      const data = await this.service.getPendingConnections(userId, dateOrder);

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
      const data: UserConnectionUpdateReqBody = {
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

          // TODO: Notify sourceUserId here to
          // know that the targetUserId accepted its request

          break;
        }

        case "REJECTED": {
          await this.service.updateConnection({
            ...data.body,
            status: "REJECTED",
          });

          // TODO: Notify sourceUserId here to
          // know that the targetUserId rejects its request

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
