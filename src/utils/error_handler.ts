import { z } from "zod";
import { KNOWN_ERRORS } from "../constants/errors";
import { ErrorReqBody, ErrorReqStack, ErrorResponse } from "../interfaces/error.interface";
import { ErrorType } from "../types";

class CustomError extends Error {
  type: ErrorType;
  where?: string;
  cause?: string;
  status?: number;

  constructor(type: ErrorType, message?: string, status?: number, where?: string, cause?: string) {
    super(message);
    this.type = type;
    this.where = where;
    this.cause = cause;
    this.status = status;

    Object.setPrototypeOf(this, CustomError.prototype);
  }
}

const identifyErrors = (err: unknown | CustomError): ErrorResponse => {
  let res: ErrorResponse = {
    status: 500,
    error: {
      code: "internal-server-error",
      message: "Unknown internal server error",
      cause: null,
      where: null,
    },
    timestamp: new Date().toISOString(),
  };

  if (err instanceof CustomError) {
    const knownError = KNOWN_ERRORS[err.type];

    res = {
      status: err.status ?? knownError.status,
      error: {
        code: err.type,
        message: !err.message || err.message === "" ? knownError.message : err.message,
        cause: err.cause ?? null,
        where: err.where ?? null,
      },
      timestamp: new Date().toISOString(),
    };
  }

  return res;
};

export const bodyError = (err: z.ZodError): ErrorReqStack => {
  const errorReqStack: ErrorReqStack = {
    errors: [],
    code: 400,
  };

  err.issues.forEach((val) => {
    const error: ErrorReqBody = {
      message: val.message,
      code: val.code,
      where: val.path[1].toString(),
    };

    errorReqStack.errors.push(error);
  });

  return errorReqStack;
};

export { identifyErrors, CustomError };
