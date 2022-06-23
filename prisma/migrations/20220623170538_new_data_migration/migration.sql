/*
  Warnings:

  - You are about to drop the column `doctorId` on the `records` table. All the data in the column will be lost.
  - You are about to drop the `Doctor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `laborante` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `nurse` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `receptionist` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Doctor" DROP CONSTRAINT "Doctor_clinicId_fkey";

-- DropForeignKey
ALTER TABLE "laborante" DROP CONSTRAINT "laborante_clinicId_fkey";

-- DropForeignKey
ALTER TABLE "nurse" DROP CONSTRAINT "nurse_clinicId_fkey";

-- DropForeignKey
ALTER TABLE "receptionist" DROP CONSTRAINT "receptionist_clinicId_fkey";

-- DropForeignKey
ALTER TABLE "records" DROP CONSTRAINT "records_doctorId_fkey";

-- AlterTable
ALTER TABLE "records" DROP COLUMN "doctorId";

-- DropTable
DROP TABLE "Doctor";

-- DropTable
DROP TABLE "laborante";

-- DropTable
DROP TABLE "nurse";

-- DropTable
DROP TABLE "receptionist";

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "contact" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "sector" TEXT NOT NULL,
    "cell" TEXT NOT NULL,
    "village" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "clinicId" INTEGER NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
