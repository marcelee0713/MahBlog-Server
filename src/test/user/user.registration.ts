import { it, expect } from "@jest/globals";
import request from "supertest";
import jwt from "jsonwebtoken";
import { app } from "../..";
import { TOKENS_LIFESPAN } from "../../constants";
import { PayloadType } from "../../types/user/user.session.types";
import { UpdateUserUseCase } from "../../types/user/user.types";

const email = "johndoe@fakemail.com";

export const UserRegisterationTestSuite = () => {
  let userId = "";

  const password = "P@ssword123";

  it("Should create a user.", async () => {
    const body = {
      email,
      password,
      firstName: "John",
      lastName: "Doe",
    };

    const response = await request(app)
      .post("/api/v1/user/sign-up")
      .send({
        ...body,
      });

    userId = response.body.data.userId;

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "Created a user");
  });

  it("Should send an error that the user is unverified.", async () => {
    const body = {
      email,
      password,
    };

    const response = await request(app)
      .post("/api/v1/user/sign-in")
      .send({
        ...body,
      });

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error.message).toBe("User is not verified.");
  });

  it("Should verify its user email.", async () => {
    const secret = process.env.EMAIL_VERIFICATION_SECRETKEY as string;

    const token = jwt.sign({ email, userId } as PayloadType<"EMAIL_VERIFY">, secret, {
      expiresIn: TOKENS_LIFESPAN.EMAIL_VERIFY,
    });

    const body = {
      email,
      token,
      useCase: "VERIFY_EMAIL" as UpdateUserUseCase,
    };

    const response = await request(app)
      .put("/api/v1/user/verify-email")
      .send({
        ...body,
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe(`Use case used: ${body.useCase}`);
  });
};
