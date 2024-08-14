import "reflect-metadata";
import express from "express";
import * as dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/user.routes";
import userProfileRouter from "./routes/user.profile.routes";
import userReportsRouter from "./routes/user.reports.routes";
import userConnectionsRouter from "./routes/user.connections.routes";

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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Currently listening to port: " + PORT);
});

app.use("/api/v1/user", userRouter);
app.use("/api/v1/user-profile", userProfileRouter);
app.use("/api/v1/user-reports", userReportsRouter);
app.use("/api/v1/user-connect", userConnectionsRouter);

// TODO: UserNotifications <--- do this when Blog is done.
// TODO: Interactors, Repo, and Controllers, and routes (if applicable)
