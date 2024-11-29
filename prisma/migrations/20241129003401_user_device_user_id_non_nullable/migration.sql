/*
  Warnings:

  - Made the column `userId` on table `UserDevices` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "UserDevices" ALTER COLUMN "userId" SET NOT NULL;
