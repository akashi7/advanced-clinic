-- AlterTable
ALTER TABLE "records" ADD COLUMN     "disease" TEXT,
ADD COLUMN     "newCase" TEXT;

-- CreateTable
CREATE TABLE "medicalHistory" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "symptoms" TEXT NOT NULL,
    "observation" TEXT NOT NULL,
    "chronicDesease" TEXT NOT NULL,
    "firstAid" TEXT NOT NULL,
    "recordId" INTEGER NOT NULL,

    CONSTRAINT "medicalHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "medicalHistory" ADD CONSTRAINT "medicalHistory_recordId_fkey" FOREIGN KEY ("recordId") REFERENCES "records"("record_code") ON DELETE RESTRICT ON UPDATE CASCADE;
