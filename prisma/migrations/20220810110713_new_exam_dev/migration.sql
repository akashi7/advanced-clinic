-- AlterTable
ALTER TABLE "exam" ADD COLUMN     "conducted" TEXT NOT NULL DEFAULT E'no',
ALTER COLUMN "exam" SET NOT NULL,
ALTER COLUMN "exam" SET DATA TYPE TEXT;
