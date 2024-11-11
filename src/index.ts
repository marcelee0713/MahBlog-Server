import "reflect-metadata";
import express from "express";
import * as dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import passport from "passport";
import userRouter from "./routes/users/user.routes";
import userProfileRouter from "./routes/users/user.profile.routes";
import userReportsRouter from "./routes/users/user.reports.routes";
import userConnectionsRouter from "./routes/users/user.connections.routes";
import blogRouter from "./routes/blogs/blog.routes";
import blogContentsRouter from "./routes/blogs/blog.contents.routes";
import blogCommentsRouter from "./routes/blogs/blog.comments.routes";
import blogCommentRepliesRouter from "./routes/blogs/blog.comment.replies.routes";

dotenv.config();

export const app = express();

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: [process.env.CLIENT_BASE_URL as string],
    credentials: true,
  })
);
app.set("trust proxy", 1);
app.use(passport.initialize());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Currently listening to port: " + PORT);
});

app.use("/api/v1/user", userRouter);
app.use("/api/v1/user-profile", userProfileRouter);
app.use("/api/v1/user-reports", userReportsRouter);
app.use("/api/v1/user-connect", userConnectionsRouter);

app.use("/api/v1/blog", blogRouter);
app.use("/api/v1/blog-contents", blogContentsRouter);
app.use("/api/v1/blog-comment", blogCommentsRouter);
app.use("/api/v1/blog-comment/reply", blogCommentRepliesRouter);

// TODO: UserNotifications <--- do this when Blog is done.
// TODO: Interactors, Repo, and Controllers, and routes (if applicable)
