/*
  Warnings:

  - The primary key for the `UserDevices` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userDevicesId` on the `UserDevices` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserDevices" DROP CONSTRAINT "UserDevices_pkey",
DROP COLUMN "userDevicesId",
ADD CONSTRAINT "UserDevices_pkey" PRIMARY KEY ("userId", "deviceId");
