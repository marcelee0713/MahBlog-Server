import { injectable } from "inversify";
import { IUserReports } from "../../interfaces/user/user.reports.interface";
import { ErrorType } from "../../types";
import { ReportCategories, ReportType } from "../../types/user/user.reports.type";

@injectable()
export class UserReports implements IUserReports {
  reportId!: string;
  userId?: string | null;
  email?: string | null;
  description!: string | undefined;
  type!: ReportType;
  category!: ReportCategories;
  validateDesc = (desc?: string) => {
    if (desc && desc.length > 500) throw new Error("invalid-error-description" as ErrorType);
  };
}
