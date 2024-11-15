import { db } from "../config/db";

export const DatabaseTearDown = async () => {
  try {
    await db.users.deleteMany();
  } catch (err) {
    throw new Error("Something went wrong " + err);
  } finally {
    await db.$disconnect();
  }
};
