/*
  Warnings:

  - You are about to drop the column `itemId` on the `invoice_details` table. All the data in the column will be lost.
  - You are about to drop the column `itemId` on the `priceList` table. All the data in the column will be lost.
  - You are about to drop the `itemList` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `clinicId` to the `priceList` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "invoice_details" DROP CONSTRAINT "invoice_details_itemId_fkey";

-- DropForeignKey
ALTER TABLE "itemList" DROP CONSTRAINT "itemList_clinicId_fkey";

-- DropForeignKey
ALTER TABLE "priceList" DROP CONSTRAINT "priceList_itemId_fkey";

-- AlterTable
ALTER TABLE "invoice_details" DROP COLUMN "itemId";

-- AlterTable
ALTER TABLE "priceList" DROP COLUMN "itemId",
ADD COLUMN     "clinicId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "itemList";

-- CreateTable
CREATE TABLE "examList" (
    "id" SERIAL NOT NULL,
    "Name" TEXT NOT NULL,
    "Code" TEXT NOT NULL,
    "dexcription" TEXT NOT NULL,
    "priceTag" INTEGER NOT NULL,
    "clinicId" INTEGER NOT NULL,

    CONSTRAINT "examList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consultation" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "clinicId" INTEGER NOT NULL,
    "consultation" TEXT NOT NULL,

    CONSTRAINT "consultation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "examList" ADD CONSTRAINT "examList_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consultation" ADD CONSTRAINT "consultation_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "priceList" ADD CONSTRAINT "priceList_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
