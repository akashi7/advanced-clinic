/*
  Warnings:

  - Added the required column `code` to the `patient` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "patient" ADD COLUMN     "code" TEXT NOT NULL;
