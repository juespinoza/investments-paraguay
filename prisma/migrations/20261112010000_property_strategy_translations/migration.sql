-- CreateEnum
CREATE TYPE "StrategyStatus" AS ENUM ('PENDING', 'READY');

-- CreateEnum
CREATE TYPE "RentKind" AS ENUM ('ACTUAL', 'ESTIMATED');

-- CreateEnum
CREATE TYPE "RentStrategy" AS ENUM ('LONG_TERM', 'SHORT_TERM', 'COMMERCIAL', 'RESALE');

-- CreateEnum
CREATE TYPE "TranslationStatus" AS ENUM ('AUTO', 'REVIEWED');

-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "amenities" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "builtM2" DECIMAL(10,2),
ADD COLUMN     "depthM" DECIMAL(8,2),
ADD COLUMN     "frontM" DECIMAL(8,2),
ADD COLUMN     "landM2" DECIMAL(12,2),
ADD COLUMN     "sourceAgentName" TEXT,
ADD COLUMN     "sourceOffice" TEXT,
ADD COLUMN     "sourceUrl" TEXT;

-- CreateTable
CREATE TABLE "PropertyStrategy" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "status" "StrategyStatus" NOT NULL DEFAULT 'PENDING',
    "summary" TEXT,
    "rentStrategy" "RentStrategy",
    "rentKind" "RentKind",
    "monthlyRent" DECIMAL(14,2),
    "occupancyPct" DECIMAL(5,2),
    "managementFeePct" DECIMAL(5,2),
    "monthlyExpenses" DECIMAL(14,2),
    "annualTaxes" DECIMAL(14,2),
    "acquisitionCostsPct" DECIMAL(5,2),
    "appreciationPct" DECIMAL(5,2),
    "zonePricePerM2" DECIMAL(14,2),
    "zonePriceSource" TEXT,
    "comparables" JSONB,
    "businessOptions" JSONB,
    "zoneSummary" TEXT,
    "risks" TEXT,
    "methodology" TEXT,
    "readyAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PropertyStrategy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyTranslation" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "summary" TEXT,
    "zoneSummary" TEXT,
    "risks" TEXT,
    "methodology" TEXT,
    "businessOptions" JSONB,
    "status" "TranslationStatus" NOT NULL DEFAULT 'AUTO',
    "sourceHash" TEXT NOT NULL,
    "model" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PropertyTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PropertyStrategy_propertyId_key" ON "PropertyStrategy"("propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "PropertyTranslation_propertyId_locale_key" ON "PropertyTranslation"("propertyId", "locale");

-- AddForeignKey
ALTER TABLE "PropertyStrategy" ADD CONSTRAINT "PropertyStrategy_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyTranslation" ADD CONSTRAINT "PropertyTranslation_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

