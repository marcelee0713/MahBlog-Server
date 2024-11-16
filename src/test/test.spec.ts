import { beforeAll, describe, afterAll, expect } from "@jest/globals";
import { UserRegisterationTestSuite } from "./user/user.registration";
import { UserChangeEmailTestSuite } from "./user/user.change_email";
import { UserResetPasswordTestSuite } from "./user/user.reset_password";
import { CreateUserTest, DatabaseTearDown } from "./setup";
import { BlogTestSuite } from "./blog/blog";
import { BlogCommentTestSuite } from "./blog/blog-comment";

beforeAll(async () => {
  await CreateUserTest();
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

describe("Core Test Suite", () => {
  describe("Blog Utilization", () => {
    BlogTestSuite();
  });

  describe("Blog Comment Utilization", () => {
    BlogCommentTestSuite();
  });
});

afterAll(async () => {
  const res = await DatabaseTearDown();
  expect(res).resolves;
});
