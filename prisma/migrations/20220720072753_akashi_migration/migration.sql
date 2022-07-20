/*
  Warnings:

  - You are about to drop the column `insurance` on the `priceList` table. All the data in the column will be lost.
  - You are about to drop the column `itemName` on the `priceList` table. All the data in the column will be lost.
  - Added the required column `insuranceId` to the `priceList` table without a default value. This is not possible if the table is not empty.
  - Added the required column `itemId` to the `priceList` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `priceList` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "patient" ADD COLUMN     "FatherIdnumber" TEXT,
ADD COLUMN     "GuardianIdNumber" TEXT,
ADD COLUMN     "MotherIdnumber" TEXT;

-- AlterTable
ALTER TABLE "priceList" DROP COLUMN "insurance",
DROP COLUMN "itemName",
ADD COLUMN     "insuranceId" INTEGER NOT NULL,
ADD COLUMN     "itemId" INTEGER NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "priceList" ADD CONSTRAINT "priceList_insuranceId_fkey" FOREIGN KEY ("insuranceId") REFERENCES "insurance"("id") ON DELETE CASCADE ON UPDATE CASCADE;
