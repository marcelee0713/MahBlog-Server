/*
  Warnings:

  - The primary key for the `UserDevices` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The required column `userDevicesId` was added to the `UserDevices` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "UserDevices" DROP CONSTRAINT "UserDevices_pkey",
ADD COLUMN     "userDevicesId" TEXT NOT NULL,
ADD CONSTRAINT "UserDevices_pkey" PRIMARY KEY ("userDevicesId");
