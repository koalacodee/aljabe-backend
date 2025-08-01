/*
  Warnings:

  - The values [TERMS_PDF] on the enum `MediaType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "MediaType_new" AS ENUM ('HEADER_LOGO', 'LANDING_VIDEO', 'TERMS_LOGO', 'START_AUDIO', 'END_AUDIO');
ALTER TABLE "media" ALTER COLUMN "type" TYPE "MediaType_new" USING ("type"::text::"MediaType_new");
ALTER TYPE "MediaType" RENAME TO "MediaType_old";
ALTER TYPE "MediaType_new" RENAME TO "MediaType";
DROP TYPE "MediaType_old";
COMMIT;
