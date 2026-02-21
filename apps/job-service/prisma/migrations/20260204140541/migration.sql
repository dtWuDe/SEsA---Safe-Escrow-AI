/*
  Warnings:

  - Added the required column `amount` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "amount" BIGINT NOT NULL,
ADD COLUMN     "arbitratorWallet" TEXT,
ALTER COLUMN "jobCommitment" DROP NOT NULL;
