/*
  Warnings:

  - Added the required column `updatedAt` to the `chronicDesease` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `symptoms` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "chronicDesease" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "symptoms" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
