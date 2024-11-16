import { db } from "../config/db";
import bcrypt from "bcryptjs";

export const DatabaseTearDown = async () => {
  try {
    await db.users.deleteMany();
  } catch (err) {
    throw new Error("Something went wrong " + err);
  } finally {
    await db.$disconnect();
  }
};

export const CreateUserTest = async () => {
  try {
    await db.users.create({
      data: {
        email: "janedoe@fakemail.com",
        password: await bcrypt.hash("P@ssword123", 10),
        emailVerifiedAt: new Date(),
        profile: {
          create: {
            firstName: "Jane",
            lastName: "Doe",
          },
        },
      },
    });
  } catch (err) {
    throw new Error("Something went wrong " + err);
  } finally {
    await db.$disconnect();
  }
};
