/*
  Warnings:

  - You are about to drop the column `medecine` on the `stock` table. All the data in the column will be lost.
  - Added the required column `item` to the `stock` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "stock" DROP COLUMN "medecine",
ADD COLUMN     "item" TEXT NOT NULL;
