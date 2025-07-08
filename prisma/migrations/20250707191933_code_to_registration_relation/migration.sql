-- AlterTable
ALTER TABLE "codes" ADD COLUMN     "registrationId" UUID;

-- AddForeignKey
ALTER TABLE "codes" ADD CONSTRAINT "codes_registrationId_fkey" FOREIGN KEY ("registrationId") REFERENCES "registrations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
