/*
  Warnings:

  - Added the required column `clinicId` to the `payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "payment" ADD COLUMN     "clinicId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
