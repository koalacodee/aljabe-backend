/*
  Warnings:

  - A unique constraint covering the columns `[phone]` on the table `registrations` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "registrations_phone_key" ON "registrations"("phone");
