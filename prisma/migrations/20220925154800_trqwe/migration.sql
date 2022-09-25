-- DropForeignKey
ALTER TABLE "priceList" DROP CONSTRAINT "priceList_insuranceId_fkey";

-- AlterTable
ALTER TABLE "priceList" ADD COLUMN     "private" BOOLEAN NOT NULL DEFAULT false;
