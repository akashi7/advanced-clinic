/*
  Warnings:

  - You are about to drop the column `observation` on the `records` table. All the data in the column will be lost.
  - The `disease` column on the `records` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "records" DROP COLUMN "observation",
ADD COLUMN     "medecines" TEXT[],
DROP COLUMN "disease",
ADD COLUMN     "disease" TEXT[];
