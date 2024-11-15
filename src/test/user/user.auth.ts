import { it, expect } from "@jest/globals";
import request from "supertest";
import jwt from "jsonwebtoken";
import { app } from "../..";
import { TOKENS_LIFESPAN, UPDATE_DAYS_COOLDOWN } from "../../constants";
import { PayloadType } from "../../types/user/user.session.types";
import { UpdateUserUseCase } from "../../types/user/user.types";
import { ErrorType } from "../../types";

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

export const UserChangeEmailTestSuite = () => {
  let userId = "";
  let token = "";
  const newEmail = "newjohndoe@fakemail.com";
  const password = "P@ssword12";

  const secret = process.env.EMAIL_CHANGE_SECRETKEY as string;

  it("Should sign in and get data", async () => {
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

    token = authorizationHeader.split(" ")[1];

    const getDataRes = await request(app)
      .get("/api/v1/user/")
      .set("Authorization", `Bearer ${token}`);

    expect(getDataRes.status).toBe(200);
    expect(getDataRes.body).toHaveProperty("data");

    userId = getDataRes.body.data.userId;
  });

  it("Should send an email change request.", async () => {
    const body = {
      email,
      newEmail,
      useCase: "CHANGE_EMAIL" as UpdateUserUseCase,
    };

    const response = await request(app)
      .post("/api/v1/user/req-change-email")
      .set("Authorization", `Bearer ${token}`)
      .send({
        ...body,
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe(`Use case used: ${body.useCase}`);
  });

  it("Should reject an expired email change request.", async () => {
    const expiredToken = jwt.sign(
      { userId, newEmail, oldEmail: email } as PayloadType<"EMAIL_CHANGE">,
      secret,
      {
        expiresIn: -1,
      }
    );

    const body = {
      token: expiredToken,
    };

    const response = await request(app)
      .put("/api/v1/user/change-email")
      .set("Authorization", `Bearer ${token}`)
      .send({
        ...body,
      });

    expect(response.status).toBe(410);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error.message).toBe("This request have been expired.");
  });

  let usedToken = "";

  it("Should update a new email address.", async () => {
    const validToken = jwt.sign(
      { userId, newEmail, oldEmail: email } as PayloadType<"EMAIL_CHANGE">,
      secret,
      {
        expiresIn: TOKENS_LIFESPAN.EMAIL_CHANGE,
      }
    );

    const body = {
      token: validToken,
    };

    const response = await request(app)
      .put("/api/v1/user/change-email")
      .set("Authorization", `Bearer ${token}`)
      .send({
        ...body,
      });

    expect(response.status).toBe(200);

    usedToken = validToken;
  });

  it("Should verify its new email address.", async () => {
    const secret = process.env.EMAIL_VERIFICATION_SECRETKEY as string;

    const token = jwt.sign({ email: newEmail, userId } as PayloadType<"EMAIL_VERIFY">, secret, {
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

  it("Should sign in with the new email address", async () => {
    const body = {
      newEmail,
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

    token = authorizationHeader.split(" ")[1];
  });

  it("Should reject a used email change request.", async () => {
    const body = {
      token: usedToken,
    };

    const response = await request(app)
      .put("/api/v1/user/change-email")
      .set("Authorization", `Bearer ${token}`)
      .send({
        ...body,
      });

    expect(response.status).toBe(409);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error.message).toBe("This request have been already used.");
  });

  it(`Should not allow to update an email due to a ${UPDATE_DAYS_COOLDOWN.NAME_AND_EMAIL} day cooldown period.`, async () => {
    const body = {
      newEmail: "anothernewjohndoe@fakemail.com",
      email: newEmail,
      useCase: "CHANGE_EMAIL" as UpdateUserUseCase,
    };

    const response = await request(app)
      .post("/api/v1/user/req-change-email")
      .set("Authorization", `Bearer ${token}`)
      .send({
        ...body,
      });

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error.code).toBe("user-modification-denied" as ErrorType);
  });

  it("Should sign out the user", async () => {
    const response = await request(app)
      .delete("/api/v1/user/sign-out")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Successfully logged out.");
  });
};
