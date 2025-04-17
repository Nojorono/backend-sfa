-- AlterTable
ALTER TABLE "users" ADD COLUMN     "last_login" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "customers" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "alias" VARCHAR(255),
    "category" VARCHAR(100),
    "owner" VARCHAR(255),
    "phone" VARCHAR(50),
    "npwp" VARCHAR(50),
    "ktp" VARCHAR(50),
    "route_id" INTEGER,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" VARCHAR(50) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);
