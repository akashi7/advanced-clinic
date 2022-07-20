/*
  Warnings:

  - You are about to drop the column `type` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `Clinic` table. All the data in the column will be lost.
  - You are about to drop the column `contact` on the `Clinic` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `Clinic` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Clinic` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `patient` table. All the data in the column will be lost.
  - You are about to drop the column `closeFullName` on the `patient` table. All the data in the column will be lost.
  - You are about to drop the column `closePhone` on the `patient` table. All the data in the column will be lost.
  - You are about to drop the column `contact` on the `patient` table. All the data in the column will be lost.
  - Added the required column `clinicCode` to the `Clinic` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contactEmail` to the `Clinic` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contactName` to the `Clinic` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contactPhone` to the `Clinic` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contactTitle` to the `Clinic` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `laborante` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `nurse` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idNumber` to the `patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `receptionist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `insuranceCode` to the `records` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Admin" DROP COLUMN "type";

-- AlterTable
ALTER TABLE "Clinic" DROP COLUMN "address",
DROP COLUMN "contact",
DROP COLUMN "password",
DROP COLUMN "type",
ADD COLUMN     "clinicCode" TEXT NOT NULL,
ADD COLUMN     "contactEmail" TEXT NOT NULL,
ADD COLUMN     "contactName" TEXT NOT NULL,
ADD COLUMN     "contactPhone" TEXT NOT NULL,
ADD COLUMN     "contactTitle" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "doctor" ADD COLUMN     "gender" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "laborante" ADD COLUMN     "gender" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "nurse" ADD COLUMN     "gender" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "patient" DROP COLUMN "address",
DROP COLUMN "closeFullName",
DROP COLUMN "closePhone",
DROP COLUMN "contact",
ADD COLUMN     "FatherName" TEXT,
ADD COLUMN     "FatherPhone" TEXT,
ADD COLUMN     "GuardianNames" TEXT,
ADD COLUMN     "GuardianPhone" TEXT,
ADD COLUMN     "MotherName" TEXT,
ADD COLUMN     "MotherPhone" TEXT,
ADD COLUMN     "idNumber" TEXT NOT NULL,
ADD COLUMN     "isInfant" BOOLEAN,
ADD COLUMN     "phone" INTEGER NOT NULL,
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "marital_status" DROP NOT NULL;

-- AlterTable
ALTER TABLE "receptionist" ADD COLUMN     "gender" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "records" ADD COLUMN     "insuranceCode" INTEGER NOT NULL;
