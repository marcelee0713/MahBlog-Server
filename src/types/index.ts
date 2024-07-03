export type ErrorType =
  | "internal-server-error"
  | "session-does-not-exist"
  | "user-does-not-exist"
  | "user-session-does-not-exist"
  | "user-session-expired"
  | "user-already-exist"
  | "user-not-authorized"
  | "user-enters-same-password"
  | "missing-inputs"
  | "invalid-first-name"
  | "invalid-last-name"
  | "invalid-middle-name"
  | "invalid-email"
  | "invalid-password"
  | "invalid-bio"
  | "wrong-credentials"
  | "authorization-header-missing"
  | "request-expired";

type FunctionKey<T> = {
  [K in keyof T]: T[K] extends CallableFunction ? K : never;
}[keyof T];

export type ExcludeFunctions<T> = Omit<T, FunctionKey<T>>;

export type ResponseStatus = "success" | "error";
