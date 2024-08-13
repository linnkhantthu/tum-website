/*
  Warnings:

  - You are about to drop the column `subcategoryId` on the `Category` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_subcategoryId_fkey";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "subcategoryId";

-- AlterTable
ALTER TABLE "Subcategory" ADD COLUMN     "categoryId" TEXT;

-- AddForeignKey
ALTER TABLE "Subcategory" ADD CONSTRAINT "Subcategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
