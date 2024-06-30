-- CreateEnum
CREATE TYPE "LogType" AS ENUM ('UPDATE_PASSWORD', 'UPDATE_EMAIL', 'UPDATE_NAME', 'OTHER');

-- CreateTable
CREATE TABLE "UserLogs" (
    "logId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "LogType" NOT NULL DEFAULT 'OTHER',

    CONSTRAINT "UserLogs_pkey" PRIMARY KEY ("logId")
);

-- AddForeignKey
ALTER TABLE "UserLogs" ADD CONSTRAINT "UserLogs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("userId") ON DELETE SET NULL ON UPDATE CASCADE;
