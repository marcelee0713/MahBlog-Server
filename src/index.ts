import * as dotenv from "dotenv";
import express from "express";

dotenv.config();

export const app = express();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Currently listening to port: " + PORT);
});
