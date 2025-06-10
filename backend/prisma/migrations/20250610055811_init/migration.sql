-- CreateEnum
CREATE TYPE "Audience" AS ENUM ('USER', 'PROVIDER');

-- CreateEnum
CREATE TYPE "AudienceType" AS ENUM ('INDIVIDUAL', 'COMPANY');

-- CreateEnum
CREATE TYPE "TaskCategory" AS ENUM ('GARDENING', 'CLEANING', 'TUTORING');

-- CreateEnum
CREATE TYPE "OfferStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "WorkNature" AS ENUM ('ONSITE', 'ONLINE');

-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('USD', 'AUD', 'SGD', 'INR');

-- CreateTable
CREATE TABLE "Account" (
    "id" SERIAL NOT NULL,
    "role" "Audience" NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "mobileNumber" TEXT NOT NULL,
    "type" "AudienceType" NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "companyName" TEXT,
    "companyPhoneNumber" TEXT,
    "taxID" VARCHAR(10),
    "repFirstName" TEXT,
    "repLastName" TEXT,
    "addressStreetNumber" TEXT,
    "addressStreetName" TEXT,
    "addressCitySuburb" TEXT,
    "addressState" TEXT,
    "addressPostcode" TEXT,
    "authToken" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" SERIAL NOT NULL,
    "accountId" INTEGER NOT NULL,
    "category" "TaskCategory" NOT NULL,
    "taskName" TEXT NOT NULL,
    "taskDescription" TEXT NOT NULL,
    "expectedStartDate" TIMESTAMP(3) NOT NULL,
    "expectedHours" INTEGER NOT NULL,
    "hourlyRate" DOUBLE PRECISION NOT NULL,
    "currency" "Currency" NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "providerMarkedComplete" BOOLEAN NOT NULL DEFAULT false,
    "userAcceptedCompletion" BOOLEAN,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" SERIAL NOT NULL,
    "accountId" INTEGER NOT NULL,
    "category" "TaskCategory" NOT NULL,
    "experienceYears" INTEGER NOT NULL,
    "workNature" "WorkNature" NOT NULL,
    "hourlyRate" DOUBLE PRECISION NOT NULL,
    "currency" "Currency" NOT NULL,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Offer" (
    "id" SERIAL NOT NULL,
    "taskId" INTEGER NOT NULL,
    "accountId" INTEGER NOT NULL,
    "status" "OfferStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "Offer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskProgress" (
    "id" SERIAL NOT NULL,
    "taskId" INTEGER NOT NULL,
    "accountId" INTEGER NOT NULL,
    "progressDescription" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TaskProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_email_key" ON "Account"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_authToken_key" ON "Account"("authToken");

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Skill" ADD CONSTRAINT "Skill_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskProgress" ADD CONSTRAINT "TaskProgress_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskProgress" ADD CONSTRAINT "TaskProgress_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
