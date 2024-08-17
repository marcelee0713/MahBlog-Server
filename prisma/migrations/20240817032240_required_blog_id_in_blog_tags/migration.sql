/*
  Warnings:

  - Made the column `blogId` on table `BlogTags` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "BlogTags" ALTER COLUMN "blogId" SET NOT NULL;
