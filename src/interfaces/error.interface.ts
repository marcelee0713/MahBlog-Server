import { ErrorType } from "../types";

export interface ErrorObject {
  status: number;
  message: string;
}

export interface ErrorReqStack {
  errors: ErrorReqBody[];
  code?: "400";
}

export interface ErrorReqBody {
  message: string;
  type: string;
  where: (string | number)[];
}

export interface ErrorResponse {
  status: number;
  error: {
    code: ErrorType;
    message: string;
    where?: string;
    cause?: string;
  };
  timestamp: string;
}
