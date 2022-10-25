/*
  Warnings:

  - You are about to drop the column `priceTag` on the `stock` table. All the data in the column will be lost.
  - You are about to drop the `chronicDesease` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `symptoms` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `category` to the `stock` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "chronicDesease" DROP CONSTRAINT "chronicDesease_recordId_fkey";

-- DropForeignKey
ALTER TABLE "symptoms" DROP CONSTRAINT "symptoms_recordId_fkey";

-- AlterTable
ALTER TABLE "stock" DROP COLUMN "priceTag",
ADD COLUMN     "category" TEXT NOT NULL;

-- DropTable
DROP TABLE "chronicDesease";

-- DropTable
DROP TABLE "symptoms";
