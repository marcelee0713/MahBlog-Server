/*
  Warnings:

  - Made the column `userId` on table `BlogCommentLikes` required. This step will fail if there are existing NULL values in that column.
  - Made the column `commentId` on table `BlogCommentLikes` required. This step will fail if there are existing NULL values in that column.
  - Made the column `blogId` on table `BlogComments` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `BlogComments` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "BlogCommentLikes" ALTER COLUMN "userId" SET NOT NULL,
ALTER COLUMN "commentId" SET NOT NULL;

-- AlterTable
ALTER TABLE "BlogCommentReplies" ALTER COLUMN "updatedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "BlogComments" ALTER COLUMN "blogId" SET NOT NULL,
ALTER COLUMN "userId" SET NOT NULL,
ALTER COLUMN "updatedAt" DROP NOT NULL;

-- AlterTable
CREATE SEQUENCE blogcontents_index_seq;
ALTER TABLE "BlogContents" ALTER COLUMN "index" SET DEFAULT nextval('blogcontents_index_seq');
ALTER SEQUENCE blogcontents_index_seq OWNED BY "BlogContents"."index";
