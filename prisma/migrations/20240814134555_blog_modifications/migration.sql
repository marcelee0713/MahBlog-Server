/*
  Warnings:

  - You are about to alter the column `title` on the `BlogContents` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(80)`.
  - You are about to alter the column `title` on the `Blogs` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(80)`.
  - You are about to alter the column `description` on the `Blogs` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(150)`.
  - You are about to alter the column `title` on the `Draft` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(80)`.
  - You are about to alter the column `title` on the `DraftContents` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(80)`.
  - Made the column `commentId` on table `BlogCommentReplies` required. This step will fail if there are existing NULL values in that column.
  - Made the column `blogId` on table `BlogCommentReplies` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `BlogCommentReplies` required. This step will fail if there are existing NULL values in that column.
  - Made the column `blogId` on table `BlogContents` required. This step will fail if there are existing NULL values in that column.
  - Made the column `authorId` on table `Blogs` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
ALTER TYPE "BlogVisibility" ADD VALUE 'DRAFTED';

-- AlterTable
ALTER TABLE "BlogCommentReplies" ALTER COLUMN "commentId" SET NOT NULL,
ALTER COLUMN "blogId" SET NOT NULL,
ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "BlogContents" ALTER COLUMN "blogId" SET NOT NULL,
ALTER COLUMN "title" SET DATA TYPE VARCHAR(80);

-- AlterTable
ALTER TABLE "Blogs" ADD COLUMN     "scoresScoresId" TEXT,
ALTER COLUMN "authorId" SET NOT NULL,
ALTER COLUMN "title" DROP NOT NULL,
ALTER COLUMN "title" SET DATA TYPE VARCHAR(80),
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "description" SET DATA TYPE VARCHAR(150),
ALTER COLUMN "visiblity" DROP DEFAULT,
ALTER COLUMN "updatedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Draft" ALTER COLUMN "title" SET DATA TYPE VARCHAR(80);

-- AlterTable
ALTER TABLE "DraftContents" ALTER COLUMN "title" SET DATA TYPE VARCHAR(80);

-- CreateTable
CREATE TABLE "Scores" (
    "scoresId" TEXT NOT NULL,
    "bestScore" DOUBLE PRECISION NOT NULL,
    "controversialScore" DOUBLE PRECISION NOT NULL,
    "blogId" TEXT,
    "commentId" TEXT,

    CONSTRAINT "Scores_pkey" PRIMARY KEY ("scoresId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Scores_blogId_key" ON "Scores"("blogId");

-- CreateIndex
CREATE UNIQUE INDEX "Scores_commentId_key" ON "Scores"("commentId");

-- AddForeignKey
ALTER TABLE "Scores" ADD CONSTRAINT "Scores_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "BlogComments"("commentId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Scores" ADD CONSTRAINT "Scores_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "Blogs"("blogId") ON DELETE CASCADE ON UPDATE CASCADE;
