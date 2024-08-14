import { UPDATE_DAYS_COOLDOWN } from ".";
import { ErrorObject } from "../interfaces/error.interface";
import { ErrorType } from "../types";

export const KNOWN_ERRORS: Record<ErrorType, ErrorObject> = {
  "does-not-exist": {
    status: 404,
    message: "This data does not exist.",
  },
  "already-exist": {
    status: 409,
    message: "This data already exist.",
  },
  "internal-server-error": {
    status: 500,
    message: "Something went wrong to the server, please report it to the devs.",
  },

  "user-already-exist": {
    status: 409,
    message: "User already exist.",
  },

  "user-already-verified": {
    status: 409,
    message: "User had already verified its email.",
  },

  "user-session-expired": {
    status: 410,
    message: "User session has expired.",
  },

  "user-enters-same-password": {
    status: 400,
    message: "User can not change its password when it's the same.",
  },

  "user-modification-denied": {
    status: 403,
    message: `User can not modify it because it was recently changed, please wait for ${UPDATE_DAYS_COOLDOWN.NAME_AND_EMAIL} days in order to change it again.`,
  },

  "user-current-password-does-not-match": {
    status: 400,
    message: "User current password does not match.",
  },

  "invalid-image-upload": {
    status: 400,
    message: "Invalid image, only accepts png, jpg, jpeg, and gif with a maximum of 3mb.",
  },

  "request-expired": {
    status: 410,
    message: "This request have been expired.",
  },

  "request-already-used": {
    status: 409,
    message: "This request have been already used.",
  },

  "user-not-authorized": {
    status: 401,
    message: "User is not authorized.",
  },

  "user-not-verified": {
    status: 403,
    message: "User is not verified.",
  },

  "missing-inputs": {
    status: 400,
    message: "Please enter the value that are supposed to not be empty.",
  },

  "invalid-email": {
    status: 400,
    message: "Invalid email.",
  },

  invalid: {
    status: 400,
    message: "Invalid data.",
  },

  "invalid-password": {
    status: 400,
    message: "Invalid password, please follow the format.",
  },

  "invalid-first-name": {
    status: 400,
    message: "Invalid first name, minimum of 2 and maximum of 50 characters only.",
  },

  "invalid-middle-name": {
    status: 400,
    message: "Invalid middle name, minimum of 2 and maximum of 50 characters only.",
  },

  "invalid-last-name": {
    status: 400,
    message: "Invalid last name, minimum of 2 and maximum of 80 characters only.",
  },

  "invalid-bio": {
    status: 400,
    message: "Invalid last name, maximum of 255 characters only.",
  },

  "invalid-report-description": {
    status: 400,
    message: "Invalid description, maximum of 500 characters only.",
  },

  "wrong-credentials": {
    status: 400,
    message: "Email or password is not correct, please check your credentials.",
  },

  "authorization-header-missing": {
    status: 401,
    message: "Authorization header is currently missing.",
  },

  "email-service-error": {
    status: 500,
    message: `Something went wrong in the server that's trying to 
      communicate to the email services, please report it to the devs!`,
  },

  "media-service-error": {
    status: 500,
    message: `Something went wrong in the server that's trying to 
      communicate to the media services, please report it to the devs!`,
  },
};
