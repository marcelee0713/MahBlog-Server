import { ErrorType, ResponseStatus } from "../types";

export interface ErrorObject {
  code: number;
  type: ErrorType;
  error: string;
  status: ResponseStatus;
}

export interface ErrorReqStack {
  errors: ErrorReqBody[];
  code?: "400";
}
export interface ErrorReqBody {
  message: string;
  type: string;
  at: (string | number)[];
}
