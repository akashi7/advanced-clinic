/*
  Warnings:

  - Added the required column `fullNames` to the `record_details` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fullNames` to the `records` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "record_details" ADD COLUMN     "fullNames" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "records" ADD COLUMN     "fullNames" TEXT NOT NULL;
