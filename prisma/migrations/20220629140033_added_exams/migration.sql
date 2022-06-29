-- CreateTable
CREATE TABLE "exam" (
    "id" SERIAL NOT NULL,
    "record_code" INTEGER NOT NULL,
    "exam" TEXT[],

    CONSTRAINT "exam_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "exam" ADD CONSTRAINT "exam_record_code_fkey" FOREIGN KEY ("record_code") REFERENCES "records"("record_code") ON DELETE RESTRICT ON UPDATE CASCADE;
