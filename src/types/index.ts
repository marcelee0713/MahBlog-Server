export type ErrorType =
  | "does-not-exist"
  | "already-exist"
  | "user-session-expired"
  | "user-already-exist"
  | "user-already-verified"
  | "user-not-verified"
  | "user-not-authorized"
  | "user-enters-same-password"
  | "user-modification-denied"
  | "user-current-password-does-not-match"
  | "invalid-image-upload"
  | "missing-inputs"
  | "invalid-first-name"
  | "invalid-last-name"
  | "invalid-middle-name"
  | "invalid-email"
  | "invalid-password"
  | "invalid-bio"
  | "invalid-report-description"
  | "wrong-credentials"
  | "authorization-header-missing"
  | "request-expired"
  | "request-already-used"
  | "internal-server-error"
  | "email-service-error"
  | "media-service-error";

type FunctionKey<T> = {
  [K in keyof T]: T[K] extends CallableFunction ? K : never;
}[keyof T];

export type ExcludeFunctions<T> = Omit<T, FunctionKey<T>>;

export type ResponseStatus = "success" | "error";

export const SortOrderArr = ["asc", "desc"] as const;

export type SortOrder = (typeof SortOrderArr)[number];

export type RequestBody<T> = {
  body: T;
};
