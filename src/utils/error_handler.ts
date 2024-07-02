import { z } from "zod";
import { errors } from "../constants/errors";
import { ErrorObject, ErrorReqBody, ErrorReqStack } from "../interfaces/error.interface";
import { ErrorType } from "../types";

const identifyErrors = (err: unknown): ErrorObject => {
  if (err instanceof Error) return errors[err.message as ErrorType];

  return errors["internal-server-error"];
};

const returnError = (err: unknown): ErrorType => {
  if (err instanceof Error) return err.message as ErrorType;

  return "internal-server-error" as ErrorType;
};

export const bodyError = (err: z.ZodError): ErrorReqStack => {
  const errorReqStack: ErrorReqStack = {
    errors: [],
    code: "400",
  };

  err.issues.forEach((val) => {
    const error: ErrorReqBody = {
      message: val.message,
      type: val.code,
      at: val.path,
    };

    errorReqStack.errors.push(error);
  });

  return errorReqStack;
};

export { identifyErrors, returnError };
