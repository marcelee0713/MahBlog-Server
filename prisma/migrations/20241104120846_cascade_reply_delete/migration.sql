-- DropForeignKey
ALTER TABLE "BlogCommentReplies" DROP CONSTRAINT "BlogCommentReplies_mentionedReplyId_fkey";

-- AddForeignKey
ALTER TABLE "BlogCommentReplies" ADD CONSTRAINT "BlogCommentReplies_mentionedReplyId_fkey" FOREIGN KEY ("mentionedReplyId") REFERENCES "BlogCommentReplies"("replyId") ON DELETE SET NULL ON UPDATE CASCADE;
