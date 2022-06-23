/*
  Warnings:

  - You are about to drop the column `code` on the `patient` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "records" DROP CONSTRAINT "records_patientId_fkey";

-- DropForeignKey
ALTER TABLE "sign_vital" DROP CONSTRAINT "sign_vital_patientId_fkey";

-- DropIndex
DROP INDEX "patient_code_key";

-- AlterTable
ALTER TABLE "Doctor" ADD COLUMN     "role" TEXT NOT NULL DEFAULT E'doctor';

-- AlterTable
ALTER TABLE "laborante" ADD COLUMN     "role" TEXT NOT NULL DEFAULT E'laborante';

-- AlterTable
ALTER TABLE "nurse" ADD COLUMN     "role" TEXT NOT NULL DEFAULT E'nurse';

-- AlterTable
ALTER TABLE "patient" DROP COLUMN "code",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "patient_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "receptionist" ADD COLUMN     "role" TEXT NOT NULL DEFAULT E'receptionist';

-- AddForeignKey
ALTER TABLE "records" ADD CONSTRAINT "records_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sign_vital" ADD CONSTRAINT "sign_vital_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
