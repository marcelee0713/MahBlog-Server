-- DropForeignKey
ALTER TABLE "BlogTags" DROP CONSTRAINT "BlogTags_blogId_fkey";

-- DropForeignKey
ALTER TABLE "Draft" DROP CONSTRAINT "Draft_authorId_fkey";

-- DropForeignKey
ALTER TABLE "DraftContents" DROP CONSTRAINT "DraftContents_draftId_fkey";

-- DropForeignKey
ALTER TABLE "DraftTags" DROP CONSTRAINT "DraftTags_draftId_fkey";

-- DropForeignKey
ALTER TABLE "UserBlacklistedTokens" DROP CONSTRAINT "UserBlacklistedTokens_holderId_fkey";

-- DropForeignKey
ALTER TABLE "UserLogs" DROP CONSTRAINT "UserLogs_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserReports" DROP CONSTRAINT "UserReports_reporterId_fkey";

-- AddForeignKey
ALTER TABLE "UserBlacklistedTokens" ADD CONSTRAINT "UserBlacklistedTokens_holderId_fkey" FOREIGN KEY ("holderId") REFERENCES "Users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserReports" ADD CONSTRAINT "UserReports_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "Users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLogs" ADD CONSTRAINT "UserLogs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogTags" ADD CONSTRAINT "BlogTags_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "Blogs"("blogId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Draft" ADD CONSTRAINT "Draft_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DraftContents" ADD CONSTRAINT "DraftContents_draftId_fkey" FOREIGN KEY ("draftId") REFERENCES "Draft"("draftId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DraftTags" ADD CONSTRAINT "DraftTags_draftId_fkey" FOREIGN KEY ("draftId") REFERENCES "Draft"("draftId") ON DELETE CASCADE ON UPDATE CASCADE;
