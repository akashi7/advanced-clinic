-- CreateTable
CREATE TABLE "appointement" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "recordId" INTEGER NOT NULL,
    "patientCode" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "serviceId" INTEGER NOT NULL,
    "Date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "appointement_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "appointement" ADD CONSTRAINT "appointement_recordId_fkey" FOREIGN KEY ("recordId") REFERENCES "records"("record_code") ON DELETE RESTRICT ON UPDATE CASCADE;
