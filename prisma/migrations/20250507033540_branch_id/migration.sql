/*
  Warnings:

  - The primary key for the `branch` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `branch` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
*/

-- Step 1: Remove the default value from the id column to break the dependency
ALTER TABLE "branch" ALTER COLUMN id DROP DEFAULT;

-- Step 2: Drop the sequence if it exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_sequences WHERE schemaname = 'public' AND sequencename = 'branch_id_seq') THEN
        DROP SEQUENCE branch_id_seq;
    END IF;
END $$;

-- Step 3: Create a new sequence
CREATE SEQUENCE branch_id_seq;

-- Step 4: Update the sequence to the next available value
SELECT setval('branch_id_seq', (SELECT COALESCE(MAX(id), 0) + 1 FROM branch), false);

-- Step 5: Drop the primary key constraint
ALTER TABLE "branch" DROP CONSTRAINT IF EXISTS "branch_pkey";

-- Step 6: Add a new integer column
ALTER TABLE "branch" ADD COLUMN new_id INTEGER;

-- Step 7: Copy the data from the old column to the new one
UPDATE "branch" SET new_id = id::integer;

-- Step 8: Drop the old column
ALTER TABLE "branch" DROP COLUMN id;

-- Step 9: Rename the new column to id
ALTER TABLE "branch" RENAME COLUMN new_id TO id;

-- Step 10: Set the default value to use the sequence
ALTER TABLE "branch" ALTER COLUMN id SET DEFAULT nextval('branch_id_seq');

-- Step 11: Set the sequence to be owned by the column
ALTER SEQUENCE branch_id_seq OWNED BY branch.id;

-- Step 12: Add the primary key constraint
ALTER TABLE "branch" ADD CONSTRAINT "branch_pkey" PRIMARY KEY ("id");
