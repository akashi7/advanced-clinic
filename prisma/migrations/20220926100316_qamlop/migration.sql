/*
  Warnings:

  - The `insurance` column on the `records` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "appointement" ADD COLUMN     "Diseases" TEXT[],
ADD COLUMN     "medecines" TEXT[];

-- AlterTable
ALTER TABLE "records" DROP COLUMN "insurance",
ADD COLUMN     "insurance" INTEGER;
