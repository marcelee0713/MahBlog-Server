import { it, expect } from "@jest/globals";
import request from "supertest";
import jwt from "jsonwebtoken";
import { app } from "../..";
import { TOKENS_LIFESPAN, UPDATE_DAYS_COOLDOWN } from "../../constants";
import { PayloadType } from "../../ts/types/user/user.session.types";
import { UpdateUserUseCase } from "../../ts/types/user/user.types";
import { ErrorType } from "../../ts/types";

const email = "johndoe@fakemail.com";

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
      email: newEmail,
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
