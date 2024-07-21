import { injectable } from "inversify";
import { IUserReports } from "../../interfaces/user/user.reports.interface";
import { ErrorType } from "../../types";

@injectable()
export class UserReports implements IUserReports {
  validateDesc = (desc?: string) => {
    if (desc && desc.length > 500) throw new Error("invalid-error-description" as ErrorType);
  };
}
