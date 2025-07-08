/*
  Warnings:

  - You are about to drop the column `code` on the `registrations` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "registrations_code_key";

-- AlterTable
ALTER TABLE "registrations" DROP COLUMN "code";
