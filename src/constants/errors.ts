import { UPDATE_DAYS_COOLDOWN } from ".";
import { ErrorObject } from "../interfaces/error.interface";
import { ErrorType } from "../types";

export const errors: Record<ErrorType, ErrorObject> = {
  "internal-server-error": {
    code: 500,
    error: "Something went wrong to the server, please report it to the devs.",
    type: "internal-server-error",
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

  "user-already-verified": {
    code: 409,
    error: "User had already verified its email.",
    type: "user-already-verified",
    status: "error",
  },

  "user-session-does-not-exist": {
    code: 404,
    error: "User session does not exist.",
    type: "user-session-does-not-exist",
    status: "error",
  },

  "user-session-expired": {
    code: 410,
    error: "User session has expired.",
    type: "user-session-expired",
    status: "error",
  },

  "user-enters-same-password": {
    code: 400,
    error: "User can not change its password when it's the same.",
    type: "user-enters-same-password",
    status: "error",
  },

  "user-modification-denied": {
    code: 403,
    error: `User can not modify it because it was recently changed, please wait for ${UPDATE_DAYS_COOLDOWN.NAME_AND_EMAIL} days in order to change it again.`,
    status: "error",
    type: "user-modification-denied",
  },

  "user-current-password-does-not-match": {
    code: 400,
    error: "User current password does not match.",
    status: "error",
    type: "user-current-password-does-not-match",
  },

  "user-log-does-not-exist": {
    code: 404,
    error: "User log does not exist.",
    status: "error",
    type: "user-log-does-not-exist",
  },

  "user-blacklisted-token-does-not-exist": {
    code: 404,
    error: "User black listed token does not exist",
    status: "error",
    type: "user-blacklisted-token-does-not-exist",
  },

  "invalid-image-upload": {
    code: 400,
    error: "Invalid image, only accepts png, jpg, jpeg, and gif with a maximum of 3mb.",
    status: "error",
    type: "invalid-image-upload",
  },

  "request-expired": {
    code: 410,
    error: "This request have been expired.",
    type: "request-expired",
    status: "error",
  },

  "request-already-used": {
    code: 409,
    error: "This request have been already used.",
    type: "request-already-used",
    status: "error",
  },

  "user-not-authorized": {
    code: 401,
    error: "User is not authorized.",
    type: "user-not-authorized",
    status: "error",
  },

  "user-not-verified": {
    code: 403,
    error: "User is not verified.",
    type: "user-not-verified",
    status: "error",
  },

  "missing-inputs": {
    code: 400,
    error: "Please enter the value that are supposed to not be empty.",
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

  "wrong-credentials": {
    code: 400,
    error: "Email or password is not correct, please check your credentials.",
    type: "wrong-credentials",
    status: "error",
  },

  "authorization-header-missing": {
    code: 401,
    error: "Authorization header is currently missing.",
    type: "authorization-header-missing",
    status: "error",
  },

  "email-service-error": {
    code: 500,
    error: `Something went wrong in the server that's trying to 
      communicate to the email services, please report it to the devs!`,
    status: "error",
    type: "email-service-error",
  },
};
