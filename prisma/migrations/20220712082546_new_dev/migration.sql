/*
  Warnings:

  - You are about to drop the column `cell` on the `doctor` table. All the data in the column will be lost.
  - You are about to drop the column `contact` on the `doctor` table. All the data in the column will be lost.
  - You are about to drop the column `district` on the `doctor` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `doctor` table. All the data in the column will be lost.
  - You are about to drop the column `province` on the `doctor` table. All the data in the column will be lost.
  - You are about to drop the column `sector` on the `doctor` table. All the data in the column will be lost.
  - You are about to drop the column `village` on the `doctor` table. All the data in the column will be lost.
  - You are about to drop the column `cell` on the `laborante` table. All the data in the column will be lost.
  - You are about to drop the column `contact` on the `laborante` table. All the data in the column will be lost.
  - You are about to drop the column `district` on the `laborante` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `laborante` table. All the data in the column will be lost.
  - You are about to drop the column `province` on the `laborante` table. All the data in the column will be lost.
  - You are about to drop the column `sector` on the `laborante` table. All the data in the column will be lost.
  - You are about to drop the column `village` on the `laborante` table. All the data in the column will be lost.
  - You are about to drop the column `cell` on the `nurse` table. All the data in the column will be lost.
  - You are about to drop the column `contact` on the `nurse` table. All the data in the column will be lost.
  - You are about to drop the column `district` on the `nurse` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `nurse` table. All the data in the column will be lost.
  - You are about to drop the column `province` on the `nurse` table. All the data in the column will be lost.
  - You are about to drop the column `sector` on the `nurse` table. All the data in the column will be lost.
  - You are about to drop the column `village` on the `nurse` table. All the data in the column will be lost.
  - You are about to drop the column `cell` on the `receptionist` table. All the data in the column will be lost.
  - You are about to drop the column `contact` on the `receptionist` table. All the data in the column will be lost.
  - You are about to drop the column `district` on the `receptionist` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `receptionist` table. All the data in the column will be lost.
  - You are about to drop the column `province` on the `receptionist` table. All the data in the column will be lost.
  - You are about to drop the column `sector` on the `receptionist` table. All the data in the column will be lost.
  - You are about to drop the column `village` on the `receptionist` table. All the data in the column will be lost.
  - Added the required column `phone` to the `doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `laborante` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `nurse` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `receptionist` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "doctor" DROP COLUMN "cell",
DROP COLUMN "contact",
DROP COLUMN "district",
DROP COLUMN "password",
DROP COLUMN "province",
DROP COLUMN "sector",
DROP COLUMN "village",
ADD COLUMN     "phone" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "laborante" DROP COLUMN "cell",
DROP COLUMN "contact",
DROP COLUMN "district",
DROP COLUMN "password",
DROP COLUMN "province",
DROP COLUMN "sector",
DROP COLUMN "village",
ADD COLUMN     "phone" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "nurse" DROP COLUMN "cell",
DROP COLUMN "contact",
DROP COLUMN "district",
DROP COLUMN "password",
DROP COLUMN "province",
DROP COLUMN "sector",
DROP COLUMN "village",
ADD COLUMN     "phone" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "receptionist" DROP COLUMN "cell",
DROP COLUMN "contact",
DROP COLUMN "district",
DROP COLUMN "password",
DROP COLUMN "province",
DROP COLUMN "sector",
DROP COLUMN "village",
ADD COLUMN     "phone" TEXT NOT NULL;
