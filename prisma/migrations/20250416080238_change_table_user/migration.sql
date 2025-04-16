/*
  Warnings:

  - You are about to drop the column `first_name` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `is_verified` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `nik` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `profile_picture` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[employee_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "users_nik_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "first_name",
DROP COLUMN "is_verified",
DROP COLUMN "last_name",
DROP COLUMN "nik",
DROP COLUMN "phone",
DROP COLUMN "profile_picture",
ADD COLUMN     "created_by" TEXT,
ADD COLUMN     "employee_id" TEXT,
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "join_date" TIMESTAMP(3),
ADD COLUMN     "picture" TEXT,
ADD COLUMN     "updated_by" TEXT,
ADD COLUMN     "valid_from" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "valid_to" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "users_employee_id_key" ON "users"("employee_id");
