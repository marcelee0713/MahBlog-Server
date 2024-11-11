-- CreateEnum
CREATE TYPE "AuthenticatedAs" AS ENUM ('GOOGLE', 'LOCAL');

-- AlterTable
ALTER TABLE "UserProfile" ALTER COLUMN "lastName" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "authenticatedAs" "AuthenticatedAs" NOT NULL DEFAULT 'LOCAL',
ALTER COLUMN "password" DROP NOT NULL;
