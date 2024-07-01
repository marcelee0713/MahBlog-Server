import { errors } from "../constants/errors";
import { ErrorObject } from "../interfaces/error.interface";
import { ErrorType } from "../types";

const identifyErrors = (err: unknown): ErrorObject => {
  if (err instanceof Error) return errors[err.message as ErrorType];

  return errors["internal-server-error"];
};

const returnError = (err: unknown): ErrorType => {
  if (err instanceof Error) return err.message as ErrorType;

  return "internal-server-error" as ErrorType;
};

export { identifyErrors, returnError };
