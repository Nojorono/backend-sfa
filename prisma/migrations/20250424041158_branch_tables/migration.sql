-- AlterTable
ALTER TABLE "parameters" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "branch" (
    "id" BIGSERIAL NOT NULL,
    "organization_code" VARCHAR(3) NOT NULL,
    "organization_name" VARCHAR(250) NOT NULL,
    "organization_id" INTEGER NOT NULL,
    "org_name" VARCHAR(250) NOT NULL,
    "org_id" VARCHAR(150) NOT NULL,
    "organization_type" VARCHAR(150) NOT NULL,
    "region_code" VARCHAR(150) NOT NULL,
    "address" TEXT NOT NULL,
    "location_id" INTEGER NOT NULL,
    "valid_from" DATE NOT NULL,
    "valid_to" DATE NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" VARCHAR(25) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" VARCHAR(25) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "branch_pkey" PRIMARY KEY ("id")
);
