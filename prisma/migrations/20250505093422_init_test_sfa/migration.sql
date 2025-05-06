-- AlterTable
ALTER TABLE "customers" ALTER COLUMN "credit_exposure" SET DEFAULT '0',
ALTER COLUMN "credit_exposure" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "overall_credit_limit" SET DEFAULT '0',
ALTER COLUMN "overall_credit_limit" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "trx_credit_limit" SET DEFAULT '0',
ALTER COLUMN "trx_credit_limit" SET DATA TYPE VARCHAR(50);
