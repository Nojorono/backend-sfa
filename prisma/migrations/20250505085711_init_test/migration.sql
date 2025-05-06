/*
  Warnings:

  - You are about to alter the column `credit_exposure` on the `customers` table. The data in that column could be lost. The data in that column will be cast from `Decimal(20,2)` to `Integer`.
  - You are about to alter the column `overall_credit_limit` on the `customers` table. The data in that column could be lost. The data in that column will be cast from `Decimal(20,2)` to `Integer`.
  - You are about to alter the column `trx_credit_limit` on the `customers` table. The data in that column could be lost. The data in that column will be cast from `Decimal(20,2)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "customers" ALTER COLUMN "credit_exposure" SET DEFAULT 0,
ALTER COLUMN "credit_exposure" SET DATA TYPE INTEGER,
ALTER COLUMN "overall_credit_limit" SET DEFAULT 0,
ALTER COLUMN "overall_credit_limit" SET DATA TYPE INTEGER,
ALTER COLUMN "trx_credit_limit" SET DEFAULT 0,
ALTER COLUMN "trx_credit_limit" SET DATA TYPE INTEGER;
