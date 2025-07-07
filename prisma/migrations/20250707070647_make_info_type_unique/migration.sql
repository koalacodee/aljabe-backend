/*
  Warnings:

  - A unique constraint covering the columns `[type]` on the table `info` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "info_type_key" ON "info"("type");
