/*
  Warnings:

  - A unique constraint covering the columns `[clinicId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "User_clinicId_key" ON "User"("clinicId");
