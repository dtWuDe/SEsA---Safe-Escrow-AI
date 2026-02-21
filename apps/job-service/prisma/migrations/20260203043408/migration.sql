-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('INIT', 'WAITING_SELLER', 'SELECTED', 'ESCROW_PENDING', 'ESCROW_ACTIVE', 'COMPLETED', 'CANCELLED', 'DISPUTED');

-- CreateTable
CREATE TABLE "Job" (
    "id" TEXT NOT NULL,
    "jobCommitment" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "jobStatus" "JobStatus" NOT NULL DEFAULT 'INIT',
    "buyerUserId" TEXT NOT NULL,
    "buyerAddress" TEXT NOT NULL,
    "sellerUserId" TEXT,
    "sellerWallet" TEXT,
    "escrowId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "cancelledAt" TIMESTAMP(3),

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Job_jobCommitment_key" ON "Job"("jobCommitment");

-- CreateIndex
CREATE UNIQUE INDEX "Job_escrowId_key" ON "Job"("escrowId");
