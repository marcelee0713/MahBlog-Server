import { ErrorType, ResponseStatus } from "../types";

export interface ErrorObject {
  code: number;
  type: ErrorType;
  error: string;
  status: ResponseStatus;
}
