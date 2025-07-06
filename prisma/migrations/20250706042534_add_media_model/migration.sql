-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('HEADER_LOGO', 'LANDING_VIDEO', 'TERMS_LOGO', 'TERMS_PDF');

-- CreateTable
CREATE TABLE "media" (
    "id" TEXT NOT NULL,
    "type" "MediaType" NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);
