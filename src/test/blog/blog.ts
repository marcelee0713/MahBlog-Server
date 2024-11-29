import { it, expect } from "@jest/globals";
import request from "supertest";
import { app } from "../..";
import { BlogVisibility } from "@prisma/client";
import { UpdateBlogImageUseCase } from "../../ts/types/blog/blog.types";
import path from "path";

export const BlogTestSuite = () => {
  const email = "newjohndoe@fakemail.com";
  const password = "P@ssword12";
  let token = "";
  let userId = "";

  const otherEmail = "janedoe@fakemail.com";
  const otherPassword = "P@ssword123";
  let otherToken = "";

  it("Should sign in and get data", async () => {
    const body = {
      email,
      password,
    };

    const otherBody = {
      email: otherEmail,
      password: otherPassword,
    };

    const response = await request(app)
      .post("/api/v1/user/sign-in")
      .send({
        ...body,
      });

    const otherResponse = await request(app)
      .post("/api/v1/user/sign-in")
      .send({
        ...otherBody,
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("User signed in");

    const authorizationHeader = response.headers["authorization"];

    expect(authorizationHeader).toMatch(/^Bearer\s[\w-]+\.[\w-]+\.[\w-]+$/);

    token = authorizationHeader.split(" ")[1];

    const otherAuthorizationHeader = otherResponse.headers["authorization"];

    otherToken = otherAuthorizationHeader.split(" ")[1];

    const getDataRes = await request(app)
      .get("/api/v1/user/")
      .set("Authorization", `Bearer ${token}`);

    expect(getDataRes.status).toBe(200);
    expect(getDataRes.body).toHaveProperty("data");

    userId = getDataRes.body.data.userId;
  });

  let blogId = "";

  it("Should create a blog", async () => {
    const response = await request(app)
      .post("/api/v1/blog/")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");

    blogId = response.body.data.blogId;
  });

  it("Should return an unauthorized error when a user is viewing a private or drafted blog", async () => {
    const body = {
      authorId: userId,
      blogId,
    };

    const response = await request(app)
      .post("/api/v1/blog/get")
      .send({ ...body })
      .set("Authorization", `Bearer ${otherToken}`);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error");
  });

  it("Should edit the created blog", async () => {
    const response = await request(app)
      .put("/api/v1/blog/")
      .set("Authorization", `Bearer ${token}`)
      .field("blogId", blogId)
      .field("tags", "tag1, tag2")
      .field("visibility", "PUBLIC" as BlogVisibility)
      .field("title", "Example title")
      .field("desc", "An example description of this blog.")
      .field("updateImageMode", "CHANGE" as UpdateBlogImageUseCase)
      .attach("coverImage", path.resolve(__dirname, "../../../images/background.jpg"));

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
  });

  let blogContentId = "";

  it("Should create a blog content", async () => {
    const body = {
      blogId,
    };

    const response = await request(app)
      .post("/api/v1/blog-contents/")
      .send({
        ...body,
      })
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");

    blogContentId = response.body.data.blogContentId;
  });

  it("Should edit the created blog content", async () => {
    const response = await request(app)
      .put("/api/v1/blog-contents/")
      .set("Authorization", `Bearer ${token}`)
      .field("blogId", blogId)
      .field("blogContentId", blogContentId)
      .field("title", "Example content title")
      .field("desc", "An example description of this content.")
      .field("updateImageMode", "CHANGE" as UpdateBlogImageUseCase)
      .attach("contentImage", path.resolve(__dirname, "../../../images/background.jpg"));

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
  });

  it("Should delete the blog", async () => {
    const response = await request(app)
      .delete(`/api/v1/blog?blogId=${blogId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(response.body.message).toBe("Blog have been deleted and its images.");
  });

  it("Should sign out the user", async () => {
    const response = await request(app)
      .delete("/api/v1/user/sign-out")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Successfully logged out.");
  });
};
