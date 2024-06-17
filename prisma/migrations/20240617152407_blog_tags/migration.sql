-- AlterTable
ALTER TABLE "UserReports" ADD COLUMN     "email" TEXT;

-- CreateTable
CREATE TABLE "BlogTags" (
    "tagId" TEXT NOT NULL,
    "blogId" TEXT,
    "tag" VARCHAR(50) NOT NULL,

    CONSTRAINT "BlogTags_pkey" PRIMARY KEY ("tagId")
);

-- AddForeignKey
ALTER TABLE "BlogTags" ADD CONSTRAINT "BlogTags_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "Blogs"("blogId") ON DELETE SET NULL ON UPDATE CASCADE;
