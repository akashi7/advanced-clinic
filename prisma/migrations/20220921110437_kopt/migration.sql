/*
  Warnings:

  - The `firstAid` column on the `medicalHistory` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `HowLong` to the `medicalHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "medicalHistory" ADD COLUMN     "HowLong" TEXT NOT NULL,
ADD COLUMN     "chronicDesease" TEXT[],
ADD COLUMN     "medicationType" TEXT[],
ADD COLUMN     "medications" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "symptoms" TEXT[],
DROP COLUMN "firstAid",
ADD COLUMN     "firstAid" TEXT[];
