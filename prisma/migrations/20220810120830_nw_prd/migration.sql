/*
  Warnings:

  - Changed the type of `exam` on the `exam` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "exam" DROP COLUMN "exam",
ADD COLUMN     "exam" INTEGER NOT NULL;
