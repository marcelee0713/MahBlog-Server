import { it, expect } from "@jest/globals";
import request from "supertest";
import { app } from "../..";
import { BlogVisibility } from "@prisma/client";

export const BlogCommentTestSuite = () => {
  const email = "newjohndoe@fakemail.com";
  const password = "P@ssword12";
  let token = "";

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
  });

  let blogId = "";

  it("Should create a blog", async () => {
    const response = await request(app)
      .post("/api/v1/blog/")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");

    blogId = response.body.data.blogId;

    const editBlogResponse = await request(app)
      .put("/api/v1/blog/")
      .set("Authorization", `Bearer ${token}`)
      .field("blogId", blogId)
      .field("tags", "tag1, tag2")
      .field("visibility", "PUBLIC" as BlogVisibility)
      .field("title", "Example title")
      .field("desc", "An example description of this blog.");

    expect(editBlogResponse.status).toBe(200);
    expect(editBlogResponse.body).toHaveProperty("data");
  });

  let commentId = "";

  it("Should create a comment", async () => {
    const body = {
      blogId,
      comment: "A comment.",
    };

    const response = await request(app)
      .post("/api/v1/blog-comment/")
      .send({ ...body })
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");

    commentId = response.body.data.commentId;
  });

  it("Should edit a comment", async () => {
    const body = {
      commentId,
      newComment: "A new comment.",
    };

    const response = await request(app)
      .put("/api/v1/blog-comment/")
      .send({ ...body })
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
  });

  let replyId = "";

  it("Should create a reply to the current comment", async () => {
    const body = {
      blogId,
      commentId,
      reply: "A reply.",
    };

    const response = await request(app)
      .post("/api/v1/blog-comment/reply")
      .send({ ...body })
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");

    replyId = response.body.data.replyId;
  });

  it("Should edit the reply", async () => {
    const body = {
      replyId,
      newReply: "A new reply.",
    };

    const response = await request(app)
      .put("/api/v1/blog-comment/reply")
      .send({ ...body })
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
  });

  let otherReplyId = "";

  it("Should create a reply to the current reply", async () => {
    const body = {
      blogId,
      commentId,
      reply: "A reply to a reply.",
      mentionedReplyId: replyId,
    };

    const response = await request(app)
      .post("/api/v1/blog-comment/reply")
      .send({ ...body })
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");

    otherReplyId = response.body.data.replyId;
  });

  it("Should delete a reply", async () => {
    const body = {
      replyId: otherReplyId,
    };

    const response = await request(app)
      .delete("/api/v1/blog-comment/reply")
      .send({ ...body })
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
  });

  it("Should delete a comment", async () => {
    const body = {
      commentId,
    };

    const response = await request(app)
      .delete("/api/v1/blog-comment")
      .send({ ...body })
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
  });

  it("Should sign out the user", async () => {
    const response = await request(app)
      .delete("/api/v1/user/sign-out")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Successfully logged out.");
  });
};
