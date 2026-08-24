-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('GS', 'USD');

-- CreateEnum
CREATE TYPE "PropertyStatus" AS ENUM (
  'EN_VENTA',
  'EN_ALQUILER',
  'RESERVADA',
  'BORRADOR',
  'VENDIDA',
  'ALQUILADA',
  'RETIRADA'
);

-- Rename priceUsd to the currency-agnostic price field.
ALTER TABLE "Property" RENAME COLUMN "priceUsd" TO "price";

-- Decimal price preserves precision for GS and USD amounts.
ALTER TABLE "Property"
ALTER COLUMN "price" TYPE DECIMAL(14, 2)
USING "price"::DECIMAL(14, 2);

-- Existing prices are assumed to be USD.
ALTER TABLE "Property"
ADD COLUMN "currency" "Currency" NOT NULL DEFAULT 'USD',
ADD COLUMN "status" "PropertyStatus" NOT NULL DEFAULT 'BORRADOR',
ADD COLUMN "hasPropertyDocuments" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "locationUrl" TEXT;

-- Preserve current public behavior for existing inventory.
UPDATE "Property"
SET "status" = CASE
  WHEN "deletedAt" IS NOT NULL THEN 'RETIRADA'::"PropertyStatus"
  ELSE 'EN_VENTA'::"PropertyStatus"
END;

-- Residential fields move out of Property in the next model step.
ALTER TABLE "Property"
DROP COLUMN "bedrooms",
DROP COLUMN "bathrooms";

-- CreateIndex
CREATE INDEX "Property_status_idx" ON "Property"("status");
