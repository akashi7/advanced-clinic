/*
  Warnings:

  - Added the required column `role` to the `Clinic` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Clinic" ADD COLUMN     "role" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "laborante" ALTER COLUMN "role"
SET
DEFAULT E'laborante';

-- AlterTable
ALTER TABLE "nurse" ALTER COLUMN "role" DROP DEFAULT;
