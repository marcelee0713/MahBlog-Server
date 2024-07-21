/*
  Warnings:

  - The values [BUG,INAPPROPRIATE_BLOG,SPAM,HARASSMENT,COPYRIGHT_VIOLATION,FAKE_NEWS,HATE_SPEECH,IMPERSONATION,PHISHING,MALWARE,OTHER] on the enum `ReportType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `reportedId` on the `UserReports` table. All the data in the column will be lost.
  - You are about to drop the column `reporterId` on the `UserReports` table. All the data in the column will be lost.
  - Added the required column `category` to the `UserReports` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ReportCategory" AS ENUM ('BUG', 'INAPPROPRIATE_BLOG', 'SPAM', 'HARASSMENT', 'COPYRIGHT_VIOLATION', 'FAKE_NEWS', 'HATE_SPEECH', 'IMPERSONATION', 'PHISHING', 'MALWARE', 'OTHER');

-- AlterEnum
BEGIN;
CREATE TYPE "ReportType_new" AS ENUM ('ISSUE', 'USER_REPORT', 'BLOG_REPORT', 'COMMENT_REPORT', 'REPLY_REPORT');
ALTER TABLE "UserReports" ALTER COLUMN "type" TYPE "ReportType_new" USING ("type"::text::"ReportType_new");
ALTER TYPE "ReportType" RENAME TO "ReportType_old";
ALTER TYPE "ReportType_new" RENAME TO "ReportType";
DROP TYPE "ReportType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "UserReports" DROP CONSTRAINT "UserReports_reporterId_fkey";

-- AlterTable
ALTER TABLE "UserReports" DROP COLUMN "reportedId",
DROP COLUMN "reporterId",
ADD COLUMN     "category" "ReportCategory" NOT NULL,
ADD COLUMN     "userId" TEXT;

-- CreateTable
CREATE TABLE "ReportDetails" (
    "reportDetailId" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "reportedUserId" TEXT,
    "reportedBlogId" TEXT,
    "reportedCommentId" TEXT,
    "reportedReplyId" TEXT,

    CONSTRAINT "ReportDetails_pkey" PRIMARY KEY ("reportDetailId")
);

-- CreateIndex
CREATE UNIQUE INDEX "ReportDetails_reportId_key" ON "ReportDetails"("reportId");

-- AddForeignKey
ALTER TABLE "UserReports" ADD CONSTRAINT "UserReports_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportDetails" ADD CONSTRAINT "ReportDetails_reportDetailId_fkey" FOREIGN KEY ("reportDetailId") REFERENCES "UserReports"("reportId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportDetails" ADD CONSTRAINT "ReportDetails_reportedUserId_fkey" FOREIGN KEY ("reportedUserId") REFERENCES "Users"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportDetails" ADD CONSTRAINT "ReportDetails_reportedBlogId_fkey" FOREIGN KEY ("reportedBlogId") REFERENCES "Blogs"("blogId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportDetails" ADD CONSTRAINT "ReportDetails_reportedCommentId_fkey" FOREIGN KEY ("reportedCommentId") REFERENCES "BlogComments"("commentId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportDetails" ADD CONSTRAINT "ReportDetails_reportedReplyId_fkey" FOREIGN KEY ("reportedReplyId") REFERENCES "BlogCommentReplies"("replyId") ON DELETE SET NULL ON UPDATE CASCADE;
