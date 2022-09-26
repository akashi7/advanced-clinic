/*
  Warnings:

  - Added the required column `patientCode` to the `records` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "records" ADD COLUMN     "patientCode" INTEGER NOT NULL;
