-- CreateEnum
CREATE TYPE "EscrowStatus" AS ENUM ('INIT', 'AWAITING_FUNDING', 'AWAITING_RELEASE', 'RELEASED', 'REFUNDED', 'DISPUTED', 'CANCELLED', 'EXPIRED');

-- CreateTable
CREATE TABLE "Escrow" (
    "id" TEXT NOT NULL,
    "chainId" INTEGER NOT NULL,
    "contractAddress" TEXT NOT NULL,
    "escrowIndex" BIGINT,
    "buyerUserId" TEXT NOT NULL,
    "sellerUserId" TEXT NOT NULL,
    "buyerWallet" TEXT NOT NULL,
    "sellerWallet" TEXT NOT NULL,
    "arbitratorWallet" TEXT NOT NULL,
    "intentHash" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "jobHash" TEXT NOT NULL,
    "escrowStatus" "EscrowStatus" NOT NULL DEFAULT 'AWAITING_RELEASE',
    "txCreate" TEXT,
    "txResolve" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Escrow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChainEvent" (
    "id" TEXT NOT NULL,
    "chainId" INTEGER NOT NULL,
    "txHash" TEXT NOT NULL,
    "logIndex" INTEGER NOT NULL,
    "eventName" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "processedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChainEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Escrow_jobHash_key" ON "Escrow"("jobHash");

-- CreateIndex
CREATE UNIQUE INDEX "Escrow_chainId_contractAddress_escrowIndex_key" ON "Escrow"("chainId", "contractAddress", "escrowIndex");

-- CreateIndex
CREATE UNIQUE INDEX "ChainEvent_chainId_txHash_logIndex_key" ON "ChainEvent"("chainId", "txHash", "logIndex");
