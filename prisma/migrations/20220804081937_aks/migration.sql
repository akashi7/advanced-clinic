/*
  Warnings:

  - Added the required column `itemName` to the `invoice_details` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "invoice_details" ADD COLUMN     "itemName" TEXT NOT NULL;
