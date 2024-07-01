import { ErrorObject } from "../interfaces/error.interface";
import { ErrorType } from "../types";

export const errors: Record<ErrorType, ErrorObject> = {
  "internal-server-error": {
    code: 500,
    error: "Something went wrong to the server, please report it to the devs.",
    type: "internal-server-error",
    status: "error",
  },
  "session-does-not-exist": {
    code: 404,
    error: "User does not exist.",
    type: "user-does-not-exist",
    status: "error",
  },
  "user-does-not-exist": {
    code: 404,
    error: "User does not exist.",
    type: "user-does-not-exist",
    status: "error",
  },
  "user-already-exist": {
    code: 409,
    error: "User already exist.",
    type: "user-already-exist",
    status: "error",
  },
  "missing-inputs": {
    code: 404,
    error: "Please enter the missing inputs.",
    type: "missing-inputs",
    status: "error",
  },
  "invalid-email": {
    code: 400,
    error: "Invalid email.",
    type: "invalid-email",
    status: "error",
  },
  "invalid-password": {
    code: 400,
    error: "Invalid password, please follow the format.",
    type: "invalid-password",
    status: "error",
  },
  "invalid-first-name": {
    code: 400,
    error: "Invalid first name, minimum of 2 and maximum of 50 characters only.",
    type: "invalid-first-name",
    status: "error",
  },
  "invalid-middle-name": {
    code: 400,
    error: "Invalid middle name, minimum of 2 and maximum of 50 characters only.",
    type: "invalid-middle-name",
    status: "error",
  },
  "invalid-last-name": {
    code: 400,
    error: "Invalid last name, minimum of 2 and maximum of 80 characters only.",
    type: "invalid-last-name",
    status: "error",
  },
  "invalid-bio": {
    code: 400,
    error: "Invalid last name, maximum of 255 characters only.",
    type: "invalid-last-name",
    status: "error",
  },
};
