import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { IUserReportsService } from "../interfaces/user/user.reports.interface";
import { TYPES } from "../constants";
import { identifyErrors } from "../utils/error_handler";
import {
  CreateUserReportBlogBodyReq,
  CreateUserReportCommentBodyReq,
  CreateUserReportIssueBodyReq,
  CreateUserReportUserBodyReq,
  GetUserReportBodyReq,
} from "../types/user/user.reports.type";
import { FormatResponse } from "../utils/response_handler";

@injectable()
export class UserReportsController {
  private service: IUserReportsService;

  constructor(@inject(TYPES.UserReportsService) service: IUserReportsService) {
    this.service = service;
  }

  async onReportIssue(req: Request, res: Response) {
    try {
      const data: CreateUserReportIssueBodyReq = {
        body: { ...req.body },
      };

      await this.service.reportIssue(data.body);

      return res.status(200).json(FormatResponse({}, "Reported an Issue"));
    } catch (err) {
      const errObj = identifyErrors(err);

      return res.status(errObj.status).json(errObj);
    }
  }

  async onReportUser(req: Request, res: Response) {
    try {
      const data: CreateUserReportUserBodyReq = {
        body: { ...req.body },
      };

      await this.service.reportUser(data.body);

      return res.status(200).json(FormatResponse({}, "Reported a user"));
    } catch (err) {
      const errObj = identifyErrors(err);

      return res.status(errObj.status).json(errObj);
    }
  }

  async onReportBlog(req: Request, res: Response) {
    try {
      const data: CreateUserReportBlogBodyReq = {
        body: { ...req.body },
      };

      await this.service.reportBlog(data.body);

      return res.status(200).json(FormatResponse({}, "Reported a blog"));
    } catch (err) {
      const errObj = identifyErrors(err);

      return res.status(errObj.status).json(errObj);
    }
  }

  async onReportComment(req: Request, res: Response) {
    try {
      const data: CreateUserReportCommentBodyReq = {
        body: { ...req.body },
      };

      await this.service.reportComment(data.body);

      return res.status(200).json(FormatResponse({}, "Reported a comment"));
    } catch (err) {
      const errObj = identifyErrors(err);

      return res.status(errObj.status).json(errObj);
    }
  }

  async onReportReply(req: Request, res: Response) {
    try {
      const data: CreateUserReportCommentBodyReq = {
        body: { ...req.body },
      };

      await this.service.reportComment(data.body);

      return res.status(200).json(FormatResponse({}, "Reported a reply"));
    } catch (err) {
      const errObj = identifyErrors(err);

      return res.status(errObj.status).json(errObj);
    }
  }

  async onGetAllReports(req: Request, res: Response) {
    try {
      const data: GetUserReportBodyReq = {
        body: { ...req.body },
      };

      const reports = await this.service.getAllReports(data.body);

      return res.status(200).json(FormatResponse(reports));
    } catch (err) {
      const errObj = identifyErrors(err);

      return res.status(errObj.status).json(errObj);
    }
  }

  async onGetReport(req: Request, res: Response) {
    try {
      const userId = req.body.userId as string;
      const reportId = req.body.reportId as string;

      const report = await this.service.getReport(userId, reportId);

      return res.status(200).json(FormatResponse(report));
    } catch (err) {
      const errObj = identifyErrors(err);

      return res.status(errObj.status).json(errObj);
    }
  }

  async onDeleteAllReports(req: Request, res: Response) {
    try {
      await this.service.deleteAllReports();

      return res.status(200).json(FormatResponse({}, "Deleted all reports"));
    } catch (err) {
      const errObj = identifyErrors(err);

      return res.status(errObj.status).json(errObj);
    }
  }

  async onDeleteUserReports(req: Request, res: Response) {
    try {
      const userId = req.body.userId as string;

      await this.service.deleteUserReports(userId);

      return res.status(200).json(FormatResponse({}, "Deleted all user reports"));
    } catch (err) {
      const errObj = identifyErrors(err);

      return res.status(errObj.status).json(errObj);
    }
  }

  async onDeleteReport(req: Request, res: Response) {
    try {
      const userId = req.body.userId as string;
      const reportId = req.body.reportId as string;

      await this.service.deleteReport(userId, reportId);

      return res.status(200).json(FormatResponse({}, "Deleted a report"));
    } catch (err) {
      const errObj = identifyErrors(err);

      return res.status(errObj.status).json(errObj);
    }
  }
}
