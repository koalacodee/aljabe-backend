-- CreateTable
CREATE TABLE "registrations" (
    "id" UUID NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "city" VARCHAR(70) NOT NULL,
    "phone" CHAR(12) NOT NULL,
    "code" CHAR(10) NOT NULL,

    CONSTRAINT "registrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "codes" (
    "id" UUID NOT NULL,
    "code" CHAR(10) NOT NULL,

    CONSTRAINT "codes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "registrations_phone_key" ON "registrations"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "registrations_code_key" ON "registrations"("code");

-- CreateIndex
CREATE UNIQUE INDEX "codes_code_key" ON "codes"("code");
