/*
  Warnings:

  - Added the required column `clinicId` to the `invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `insuranceId` to the `invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rating` to the `invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `initialPrice` to the `invoice_details` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "invoice" ADD COLUMN     "clinicId" INTEGER NOT NULL,
ADD COLUMN     "insuranceId" INTEGER NOT NULL,
ADD COLUMN     "rating" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "invoice_details" ADD COLUMN     "initialPrice" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "invoice" ADD CONSTRAINT "invoice_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
