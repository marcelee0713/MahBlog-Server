import { it, expect } from "@jest/globals";
import request from "supertest";
import jwt from "jsonwebtoken";
import { app } from "../..";
import { TOKENS_LIFESPAN } from "../../constants";
import { PayloadType } from "../../ts/types/user/user.session.types";
import { UpdateUserUseCase } from "../../ts/types/user/user.types";

const email = "johndoe@fakemail.com";

export const UserResetPasswordTestSuite = () => {
  let userId = "";

  let password = "P@ssword123";

  const secret = process.env.RESET_PASSWORD_SECRETKEY as string;

  it("Should sign in, get data, and sign out", async () => {
    const body = {
      email,
      password,
    };

    const response = await request(app)
      .post("/api/v1/user/sign-in")
      .send({
        ...body,
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("User signed in");

    const authorizationHeader = response.headers["authorization"];
    expect(authorizationHeader).toMatch(/^Bearer\s[\w-]+\.[\w-]+\.[\w-]+$/);

    const token = authorizationHeader.split(" ")[1];

    const getDataRes = await request(app)
      .get("/api/v1/user/")
      .set("Authorization", `Bearer ${token}`);

    expect(getDataRes.status).toBe(200);
    expect(getDataRes.body).toHaveProperty("data");

    userId = getDataRes.body.data.userId;

    const logOutRes = await request(app)
      .delete("/api/v1/user/sign-out")
      .set("Authorization", `Bearer ${token}`);

    expect(logOutRes.status).toBe(200);
    expect(logOutRes.body.message).toBe("Successfully logged out.");
  });

  it("Should request a reset password.", async () => {
    const body = {
      email,
    };

    const response = await request(app)
      .post("/api/v1/user/req-reset-password")
      .send({
        ...body,
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "Password reset request sent");
  });

  it("Should reject an expired reset password request.", async () => {
    const token = jwt.sign({ userId } as PayloadType<"RESET_PASS">, secret, {
      expiresIn: -1,
    });

    const resetPassBody = {
      token: token,
      useCase: "RESET_PASSWORD" as UpdateUserUseCase,
      currentPassword: "P@ssword123",
      password: "P@ssword12",
      removeSession: true,
    };

    const response = await request(app)
      .put("/api/v1/user/reset-password")
      .send({
        ...resetPassBody,
      });

    expect(response.status).toBe(410);
    expect(response.body.error).toHaveProperty("message", "This request have been expired.");
  });

  let usedToken = "";

  it("Should reset password", async () => {
    const validToken = jwt.sign({ userId } as PayloadType<"RESET_PASS">, secret, {
      expiresIn: TOKENS_LIFESPAN.PASS_RESET,
    });

    const resetPassBody = {
      token: validToken,
      useCase: "RESET_PASSWORD" as UpdateUserUseCase,
      currentPassword: "P@ssword123",
      password: "P@ssword12",
      removeSession: true,
    };

    const response = await request(app)
      .put("/api/v1/user/reset-password")
      .send({
        ...resetPassBody,
      });

    password = "P@ssword12";

    usedToken = resetPassBody.token;

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", `Use case used: ${resetPassBody.useCase}`);
  });

  it("Should reject a used request reset password", async () => {
    const resetPassBody = {
      token: usedToken,
      useCase: "RESET_PASSWORD" as UpdateUserUseCase,
      currentPassword: "P@ssword123",
      password: "P@ssword12",
      removeSession: true,
    };

    const response = await request(app)
      .put("/api/v1/user/reset-password")
      .send({
        ...resetPassBody,
      });

    expect(response.status).toBe(409);
    expect(response.body.error.message).toBe("This request have been already used.");
  });

  it("Should send an error that the user sent a wrong credentials", async () => {
    const body = {
      email,
      password: "P@ssword123",
    };

    const response = await request(app)
      .post("/api/v1/user/sign-in")
      .send({
        ...body,
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error.message).toBe(
      "Email or password is not correct, please check your credentials."
    );
  });

  it("Should successfully sign in with its new password and sign out", async () => {
    const body = {
      email,
      password,
    };

    const response = await request(app)
      .post("/api/v1/user/sign-in")
      .send({
        ...body,
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("User signed in");

    const authorizationHeader = response.headers["authorization"];
    expect(authorizationHeader).toMatch(/^Bearer\s[\w-]+\.[\w-]+\.[\w-]+$/);

    const token = authorizationHeader.split(" ")[1];

    const logOutRes = await request(app)
      .delete("/api/v1/user/sign-out")
      .set("Authorization", `Bearer ${token}`);

    expect(logOutRes.status).toBe(200);
    expect(logOutRes.body.message).toBe("Successfully logged out.");
  });
};
