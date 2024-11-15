import { beforeAll, describe, afterAll, expect } from "@jest/globals";
import {
  UserChangeEmailTestSuite,
  UserRegisterationTestSuite,
  UserResetPasswordTestSuite,
} from "./user/user.auth";
import { DatabaseTearDown } from "./setup";

beforeAll(async () => {
  // const user = await CreateUserTest();
  // expect(user).toBeDefined();
});

describe("User Test Suite", () => {
  describe("User Registeration", () => {
    UserRegisterationTestSuite();
  });

  describe("User Reset Password", () => {
    UserResetPasswordTestSuite();
  });

  describe("User Change Email", () => {
    UserChangeEmailTestSuite();
  });
});

afterAll(async () => {
  const res = await DatabaseTearDown();
  expect(res).resolves;
});
