/*
  Warnings:

  - You are about to drop the column `type` on the `priceList` table. All the data in the column will be lost.
  - Added the required column `Type` to the `priceList` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "priceList" DROP COLUMN "type",
ADD COLUMN     "Type" TEXT NOT NULL;
