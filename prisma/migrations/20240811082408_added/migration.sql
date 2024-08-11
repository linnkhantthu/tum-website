-- CreateEnum
CREATE TYPE "ArticleType" AS ENUM ('PUBLIC', 'PRIVATE');

-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "type" "ArticleType" NOT NULL DEFAULT 'PRIVATE';
