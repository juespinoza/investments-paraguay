ALTER TABLE "Property"
  ADD COLUMN IF NOT EXISTS "neighborhood" TEXT,
  ADD COLUMN IF NOT EXISTS "address" TEXT,
  ADD COLUMN IF NOT EXISTS "latitude" DECIMAL(9,6),
  ADD COLUMN IF NOT EXISTS "longitude" DECIMAL(9,6),
  ADD COLUMN IF NOT EXISTS "roiAnnualPct" DECIMAL(5,2),
  ADD COLUMN IF NOT EXISTS "appreciationAnnualPct" DECIMAL(5,2),
  ADD COLUMN IF NOT EXISTS "isFeatured" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "featuredOrder" INTEGER;

CREATE INDEX IF NOT EXISTS "Property_city_idx" ON "Property"("city");
CREATE INDEX IF NOT EXISTS "Property_isFeatured_featuredOrder_updatedAt_idx"
  ON "Property"("isFeatured", "featuredOrder", "updatedAt");
