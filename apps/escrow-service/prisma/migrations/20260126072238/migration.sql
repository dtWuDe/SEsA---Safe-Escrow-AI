/*
  Warnings:

  - You are about to alter the column `amount` on the `Escrow` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `BigInt`.

*/
-- AlterTable
ALTER TABLE "Escrow" ALTER COLUMN "amount" SET DATA TYPE BIGINT;
