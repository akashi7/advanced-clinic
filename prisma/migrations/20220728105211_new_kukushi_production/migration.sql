/*
  Warnings:

  - Changed the type of `itemId` on the `invoice_details` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "invoice_details" DROP COLUMN "itemId",
ADD COLUMN     "itemId" INTEGER NOT NULL;
