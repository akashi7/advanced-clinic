/*
  Warnings:

  - You are about to drop the column `consultation` on the `records` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `records` table. All the data in the column will be lost.
  - You are about to drop the column `hasInsurance` on the `sign_vital` table. All the data in the column will be lost.
  - You are about to drop the column `insurance` on the `sign_vital` table. All the data in the column will be lost.
  - Added the required column `insurance` to the `records` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "records" DROP COLUMN "consultation"
,
DROP COLUMN "price",
ADD COLUMN     "insurance" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "sign_vital" DROP COLUMN "hasInsurance"
,
DROP COLUMN "insurance";
