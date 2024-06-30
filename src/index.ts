import "reflect-metadata";
import express from "express";
import * as dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Currently listening to port: " + PORT);
});

// TODO: Integration of Inversify
// TODO: Integration of User Entity with UserProfile, UserAuth, and etc...
