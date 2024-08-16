/*
  Warnings:

  - The values [CONNECTIONS] on the enum `BlogVisibility` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "BlogVisibility_new" AS ENUM ('PRIVATE', 'PUBLIC', 'DRAFTED');
ALTER TABLE "Blogs" ALTER COLUMN "visiblity" DROP DEFAULT;
ALTER TABLE "Blogs" ALTER COLUMN "visiblity" TYPE "BlogVisibility_new" USING ("visiblity"::text::"BlogVisibility_new");
ALTER TYPE "BlogVisibility" RENAME TO "BlogVisibility_old";
ALTER TYPE "BlogVisibility_new" RENAME TO "BlogVisibility";
DROP TYPE "BlogVisibility_old";
ALTER TABLE "Blogs" ALTER COLUMN "visiblity" SET DEFAULT 'DRAFTED';
COMMIT;
