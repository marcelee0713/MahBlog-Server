import { injectable } from "inversify";
import { IUserReports } from "../../interfaces/user/user.reports.interface";
import { ReportCategories, ReportType } from "../../types/user/user.reports.type";
import { CustomError } from "../../utils/error_handler";

@injectable()
export class UserReports implements IUserReports {
  reportId!: string;
  userId?: string | null;
  email?: string | null;
  description!: string | undefined;
  type!: ReportType;
  category!: ReportCategories;
  validateDesc = (desc?: string) => {
    if (desc && desc.length > 500) throw new CustomError("invalid-report-description");
  };
}
