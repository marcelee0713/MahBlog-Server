import { ErrorType } from "../types";

export interface ErrorObject {
  status: number;
  message: string;
}

export interface ErrorReqStack {
  errors: ErrorReqBody[];
  code: number;
}

export interface ErrorReqBody {
  message: string;
  code: string;
  where: string;
}

export interface ErrorResponse {
  status: number;
  error: {
    code: ErrorType;
    message: string;
    where: string | null;
    cause: string | null;
  };
  timestamp: string;
}
