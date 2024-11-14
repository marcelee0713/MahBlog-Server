import { it, expect } from "@jest/globals";
import request from "supertest";
import jwt from "jsonwebtoken";
import { app } from "../..";

export const UserAuthTestSuite = () => {
  it(`Should create a user.`, async () => {
    const body = {
      email: "johndoe123@hotmail.com",
      password: "P@ssword123",
      firstName: "John",
      lastName: "Doe",
    };

    const response = await request(app)
      .post("/api/v1/user/sign-up")
      .send({
        ...body,
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "Created a user");
  });
};
