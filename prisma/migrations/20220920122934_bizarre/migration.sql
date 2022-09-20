/*
  Warnings:

  - You are about to drop the column `symptoms` on the `medicalHistory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "medicalHistory" DROP COLUMN "symptoms";

-- CreateTable
CREATE TABLE "symptoms" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "symptom" TEXT NOT NULL,
    "recordId" INTEGER NOT NULL,

    CONSTRAINT "symptoms_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "symptoms" ADD CONSTRAINT "symptoms_recordId_fkey" FOREIGN KEY ("recordId") REFERENCES "records"("record_code") ON DELETE RESTRICT ON UPDATE CASCADE;
