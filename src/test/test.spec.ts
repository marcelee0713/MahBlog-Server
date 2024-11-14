import { beforeAll, describe, afterAll } from "@jest/globals";
import { UserAuthTestSuite } from "./user/user.auth";

beforeAll(async () => {
  // const user = await CreateUserTest();
  // expect(user).toBeDefined();
});

describe("User Test Suite", () => {
  describe("User Registeration", () => {
    UserAuthTestSuite();
  });
});

afterAll(async () => {
  // const res = await DatabaseTearDown();
  // expect(res).resolves;
});
