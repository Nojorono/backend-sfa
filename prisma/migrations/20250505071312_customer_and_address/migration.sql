/*
  Warnings:

  - You are about to drop the column `category` on the `customers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "customers" DROP COLUMN "category",
ADD COLUMN     "bill_to_location" VARCHAR(255),
ADD COLUMN     "bill_to_site_use_id" INTEGER,
ADD COLUMN     "channel" VARCHAR(100),
ADD COLUMN     "credit_checking" VARCHAR(50),
ADD COLUMN     "credit_exposure" DECIMAL(20,2),
ADD COLUMN     "cust_account_id" INTEGER,
ADD COLUMN     "customer_number" VARCHAR(100),
ADD COLUMN     "order_type_id" VARCHAR(50),
ADD COLUMN     "order_type_name" VARCHAR(255),
ADD COLUMN     "org_id" VARCHAR(50),
ADD COLUMN     "org_name" VARCHAR(255),
ADD COLUMN     "organization_code" VARCHAR(50),
ADD COLUMN     "organization_id" INTEGER,
ADD COLUMN     "organization_name" VARCHAR(255),
ADD COLUMN     "overall_credit_limit" DECIMAL(20,2),
ADD COLUMN     "price_list_id" INTEGER,
ADD COLUMN     "price_list_name" VARCHAR(255),
ADD COLUMN     "return_order_type_id" VARCHAR(50),
ADD COLUMN     "return_order_type_name" VARCHAR(255),
ADD COLUMN     "ship_to_location" VARCHAR(255),
ADD COLUMN     "ship_to_site_use_id" INTEGER,
ADD COLUMN     "site_type" VARCHAR(50),
ADD COLUMN     "term_day" INTEGER,
ADD COLUMN     "term_id" INTEGER,
ADD COLUMN     "term_name" VARCHAR(100),
ADD COLUMN     "trx_credit_limit" DECIMAL(20,2);

-- CreateTable
CREATE TABLE "address_customer" (
    "id" SERIAL NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "address1" VARCHAR(255),
    "provinsi" VARCHAR(100),
    "kab_kodya" VARCHAR(100),
    "kecamatan" VARCHAR(100),
    "kelurahan" VARCHAR(100),
    "kodepos" VARCHAR(10),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" VARCHAR(25) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" VARCHAR(25) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "address_customer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "address_customer" ADD CONSTRAINT "address_customer_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
