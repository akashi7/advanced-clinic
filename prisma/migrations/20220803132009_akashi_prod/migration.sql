/*
  Warnings:

  - You are about to drop the column `amountPaid` on the `records` table. All the data in the column will be lost.
  - You are about to drop the column `amountPaidByInsurance` on the `records` table. All the data in the column will be lost.
  - You are about to drop the column `amountToBePaid` on the `records` table. All the data in the column will be lost.
  - You are about to drop the column `unpaidAmount` on the `records` table. All the data in the column will be lost.
  - Added the required column `amountPaid` to the `invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `amountPaidByInsurance` to the `invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `amountToBePaid` to the `invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unpaidAmount` to the `invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priceToPay` to the `invoice_details` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "invoice" ADD COLUMN     "amountPaid" INTEGER NOT NULL,
ADD COLUMN     "amountPaidByInsurance" INTEGER NOT NULL,
ADD COLUMN     "amountToBePaid" INTEGER NOT NULL,
ADD COLUMN     "unpaidAmount" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "invoice_details" ADD COLUMN     "priceToPay" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "records" DROP COLUMN "amountPaid",
DROP COLUMN "amountPaidByInsurance",
DROP COLUMN "amountToBePaid",
DROP COLUMN "unpaidAmount";
