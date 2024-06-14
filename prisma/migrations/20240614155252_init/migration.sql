-- CreateEnum
CREATE TYPE "ConnectionStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'BLOCKED');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('SEEN', 'NOT_SEEN');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('LIKED_BLOG', 'COMMENT_BLOG', 'REPLIED_COMMENT');

-- CreateEnum
CREATE TYPE "ReportType" AS ENUM ('BUG', 'INAPPROPRIATE_BLOG', 'SPAM', 'HARASSMENT', 'COPYRIGHT_VIOLATION', 'FAKE_NEWS', 'HATE_SPEECH', 'IMPERSONATION', 'PHISHING', 'MALWARE', 'OTHER');

-- CreateEnum
CREATE TYPE "BlogVisibility" AS ENUM ('PRIVATE', 'PUBLIC', 'CONNECTIONS');

-- CreateTable
CREATE TABLE "Users" (
    "userId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "emailVerifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" "Role" NOT NULL DEFAULT 'USER',

    CONSTRAINT "Users_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "UserProfile" (
    "profileId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "firstName" VARCHAR(50) NOT NULL,
    "middleName" VARCHAR(50),
    "lastName" VARCHAR(80) NOT NULL,
    "profilePicture" TEXT,
    "profileCover" TEXT,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("profileId")
);

-- CreateTable
CREATE TABLE "UserConnections" (
    "connectionId" TEXT NOT NULL,
    "sourceUserId" TEXT NOT NULL,
    "targetUserId" TEXT NOT NULL,
    "status" "ConnectionStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserConnections_pkey" PRIMARY KEY ("connectionId")
);

-- CreateTable
CREATE TABLE "UserNotifications" (
    "notificationId" TEXT NOT NULL,
    "userId" TEXT,
    "status" "NotificationStatus" NOT NULL DEFAULT 'NOT_SEEN',
    "type" "NotificationType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserNotifications_pkey" PRIMARY KEY ("notificationId")
);

-- CreateTable
CREATE TABLE "UserSessions" (
    "sessionId" TEXT NOT NULL,
    "userId" TEXT,
    "refreshToken" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserSessions_pkey" PRIMARY KEY ("sessionId")
);

-- CreateTable
CREATE TABLE "UserBlacklistedTokens" (
    "token" TEXT NOT NULL,
    "holderId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserBlacklistedTokens_pkey" PRIMARY KEY ("token")
);

-- CreateTable
CREATE TABLE "UserReports" (
    "reportId" TEXT NOT NULL,
    "reporterId" TEXT,
    "reportedId" TEXT,
    "description" VARCHAR(500) NOT NULL,
    "type" "ReportType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserReports_pkey" PRIMARY KEY ("reportId")
);

-- CreateTable
CREATE TABLE "Blogs" (
    "blogId" TEXT NOT NULL,
    "authorId" TEXT,
    "coverImage" TEXT,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "visiblity" "BlogVisibility" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Blogs_pkey" PRIMARY KEY ("blogId")
);

-- CreateTable
CREATE TABLE "BlogContents" (
    "blogContentId" TEXT NOT NULL,
    "blogId" TEXT,
    "index" INTEGER NOT NULL,
    "title" VARCHAR(255),
    "description" TEXT,
    "contentImage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BlogContents_pkey" PRIMARY KEY ("blogContentId")
);

-- CreateTable
CREATE TABLE "BlogLikes" (
    "blogLikeId" TEXT NOT NULL,
    "blogId" TEXT,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BlogLikes_pkey" PRIMARY KEY ("blogLikeId")
);

-- CreateTable
CREATE TABLE "BlogComments" (
    "commentId" TEXT NOT NULL,
    "blogId" TEXT,
    "userId" TEXT,
    "comment" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogComments_pkey" PRIMARY KEY ("commentId")
);

-- CreateTable
CREATE TABLE "BlogCommentReplies" (
    "replyId" TEXT NOT NULL,
    "commentId" TEXT,
    "blogId" TEXT,
    "userId" TEXT,
    "mentionedReplyId" TEXT,
    "reply" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogCommentReplies_pkey" PRIMARY KEY ("replyId")
);

-- CreateTable
CREATE TABLE "BlogCommentLikes" (
    "commentLikeId" TEXT NOT NULL,
    "userId" TEXT,
    "commentId" TEXT,
    "replyId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BlogCommentLikes_pkey" PRIMARY KEY ("commentLikeId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_userId_key" ON "UserProfile"("userId");

-- AddForeignKey
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserConnections" ADD CONSTRAINT "UserConnections_sourceUserId_fkey" FOREIGN KEY ("sourceUserId") REFERENCES "Users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserConnections" ADD CONSTRAINT "UserConnections_targetUserId_fkey" FOREIGN KEY ("targetUserId") REFERENCES "Users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserNotifications" ADD CONSTRAINT "UserNotifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSessions" ADD CONSTRAINT "UserSessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBlacklistedTokens" ADD CONSTRAINT "UserBlacklistedTokens_holderId_fkey" FOREIGN KEY ("holderId") REFERENCES "Users"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserReports" ADD CONSTRAINT "UserReports_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "Users"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Blogs" ADD CONSTRAINT "Blogs_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogContents" ADD CONSTRAINT "BlogContents_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "Blogs"("blogId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogLikes" ADD CONSTRAINT "BlogLikes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogLikes" ADD CONSTRAINT "BlogLikes_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "Blogs"("blogId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogComments" ADD CONSTRAINT "BlogComments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogComments" ADD CONSTRAINT "BlogComments_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "Blogs"("blogId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogCommentReplies" ADD CONSTRAINT "BlogCommentReplies_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogCommentReplies" ADD CONSTRAINT "BlogCommentReplies_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "Blogs"("blogId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogCommentReplies" ADD CONSTRAINT "BlogCommentReplies_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "BlogComments"("commentId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogCommentReplies" ADD CONSTRAINT "BlogCommentReplies_mentionedReplyId_fkey" FOREIGN KEY ("mentionedReplyId") REFERENCES "BlogCommentReplies"("replyId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogCommentLikes" ADD CONSTRAINT "BlogCommentLikes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogCommentLikes" ADD CONSTRAINT "BlogCommentLikes_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "BlogComments"("commentId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogCommentLikes" ADD CONSTRAINT "BlogCommentLikes_replyId_fkey" FOREIGN KEY ("replyId") REFERENCES "BlogCommentReplies"("replyId") ON DELETE CASCADE ON UPDATE CASCADE;
