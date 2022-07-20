/*
  Warnings:

  - You are about to drop the column `insuranceId` on the `priceList` table. All the data in the column will be lost.
  - Added the required column `insurance` to the `priceList` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "priceList" DROP CONSTRAINT "priceList_insuranceId_fkey";

-- AlterTable
ALTER TABLE "priceList" DROP COLUMN "insuranceId",
ADD COLUMN     "insurance" TEXT NOT NULL;
