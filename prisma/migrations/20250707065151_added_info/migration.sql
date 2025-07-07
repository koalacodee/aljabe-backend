-- CreateEnum
CREATE TYPE "InfoType" AS ENUM ('X_ACCOUNT', 'PHONE_NUMBER', 'INSTAGRAM_ACCOUNT');

-- CreateTable
CREATE TABLE "info" (
    "id" TEXT NOT NULL,
    "type" "InfoType" NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "info_pkey" PRIMARY KEY ("id")
);
