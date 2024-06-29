/*
  Warnings:

  - You are about to drop the column `userId` on the `UserNotifications` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'BANNED');

-- CreateEnum
CREATE TYPE "BlogStatus" AS ENUM ('ACTIVE', 'FLAGGED');

-- AlterEnum
ALTER TYPE "NotificationType" ADD VALUE 'REJECTED_CONNECTION_STATUS';

-- DropForeignKey
ALTER TABLE "UserNotifications" DROP CONSTRAINT "UserNotifications_userId_fkey";

-- AlterTable
ALTER TABLE "Blogs" ADD COLUMN     "status" "BlogStatus" NOT NULL DEFAULT 'ACTIVE',
ALTER COLUMN "visiblity" SET DEFAULT 'PUBLIC';

-- AlterTable
ALTER TABLE "UserNotifications" DROP COLUMN "userId",
ADD COLUMN     "blogId" TEXT,
ADD COLUMN     "commentId" TEXT,
ADD COLUMN     "message" TEXT,
ADD COLUMN     "receiverId" TEXT,
ADD COLUMN     "replyId" TEXT,
ADD COLUMN     "senderId" TEXT;

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE';

-- AddForeignKey
ALTER TABLE "UserNotifications" ADD CONSTRAINT "UserNotifications_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "Users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserNotifications" ADD CONSTRAINT "UserNotifications_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "Users"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserNotifications" ADD CONSTRAINT "UserNotifications_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "Blogs"("blogId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserNotifications" ADD CONSTRAINT "UserNotifications_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "BlogComments"("commentId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserNotifications" ADD CONSTRAINT "UserNotifications_replyId_fkey" FOREIGN KEY ("replyId") REFERENCES "BlogCommentReplies"("replyId") ON DELETE SET NULL ON UPDATE CASCADE;
