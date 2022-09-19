-- CreateTable
CREATE TABLE "cashier" (
    "id" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "clinicId" INTEGER NOT NULL,

    CONSTRAINT "cashier_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "cashier" ADD CONSTRAINT "cashier_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
