/*
  Warnings:

  - You are about to drop the column `dexcription` on the `examList` table. All the data in the column will be lost.
  - Added the required column `description` to the `examList` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "examList" DROP COLUMN "dexcription",
ADD COLUMN     "description" TEXT NOT NULL;
