/*
  Warnings:

  - A unique constraint covering the columns `[user_uuid]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "customers" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "phone" TEXT,
ADD COLUMN     "user_uuid" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_user_uuid_key" ON "users"("user_uuid");
