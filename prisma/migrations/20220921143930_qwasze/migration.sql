/*
  Warnings:

  - Added the required column `doctorId` to the `appointement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "appointement" ADD COLUMN     "doctorId" INTEGER NOT NULL;
