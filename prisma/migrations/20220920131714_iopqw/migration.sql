/*
  Warnings:

  - You are about to drop the column `chronicDesease` on the `medicalHistory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "medicalHistory" DROP COLUMN "chronicDesease";

-- CreateTable
CREATE TABLE "chronicDesease" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chronicDesease" TEXT NOT NULL,
    "recordId" INTEGER NOT NULL,

    CONSTRAINT "chronicDesease_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "chronicDesease" ADD CONSTRAINT "chronicDesease_recordId_fkey" FOREIGN KEY ("recordId") REFERENCES "records"("record_code") ON DELETE RESTRICT ON UPDATE CASCADE;
