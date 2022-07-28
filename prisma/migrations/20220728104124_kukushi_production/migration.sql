/*
  Warnings:

  - You are about to drop the column `itemName` on the `invoice_details` table. All the data in the column will be lost.
  - Added the required column `itemId` to the `invoice_details` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `invoice_details` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "invoice_details" DROP COLUMN "itemName",
ADD COLUMN     "itemId" TEXT NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL;
