/*
  Warnings:

  - A unique constraint covering the columns `[site_use_id]` on the table `customers` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "customers_customer_number_key";

-- AlterTable
ALTER TABLE "customers" ADD COLUMN     "site_use_id" VARCHAR(50);

-- CreateIndex
CREATE UNIQUE INDEX "customers_site_use_id_key" ON "customers"("site_use_id");
