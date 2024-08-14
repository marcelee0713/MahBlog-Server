/*
  Warnings:

  - You are about to drop the column `scoresScoresId` on the `Blogs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Blogs" DROP COLUMN "scoresScoresId",
ALTER COLUMN "visiblity" SET DEFAULT 'DRAFTED';
