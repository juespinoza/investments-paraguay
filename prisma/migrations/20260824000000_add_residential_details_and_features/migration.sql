-- CreateEnum
CREATE TYPE "Orientation" AS ENUM ('NORTE', 'SUR', 'ESTE', 'OESTE');

-- CreateEnum
CREATE TYPE "FeatureCategory" AS ENUM (
  'EQUIPMENT',
  'AMENITY',
  'SECURITY',
  'GENERAL_SERVICE',
  'PAYMENT_METHOD',
  'FINANCING_TYPE',
  'REQUIRED_DOCUMENT'
);

-- CreateTable
CREATE TABLE "PropertyResidentialDetails" (
  "id" TEXT NOT NULL,
  "propertyId" TEXT NOT NULL,
  "bedrooms" INTEGER,
  "bathrooms" INTEGER,
  "garages" INTEGER,
  "orientation" "Orientation",
  "petFriendly" BOOLEAN NOT NULL DEFAULT false,

  CONSTRAINT "PropertyResidentialDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feature" (
  "id" TEXT NOT NULL,
  "category" "FeatureCategory" NOT NULL,
  "code" TEXT NOT NULL,
  "label" TEXT NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true,

  CONSTRAINT "Feature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyFeature" (
  "id" TEXT NOT NULL,
  "propertyId" TEXT NOT NULL,
  "featureId" TEXT NOT NULL,

  CONSTRAINT "PropertyFeature_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PropertyResidentialDetails_propertyId_key" ON "PropertyResidentialDetails"("propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "Feature_category_code_key" ON "Feature"("category", "code");

-- CreateIndex
CREATE UNIQUE INDEX "PropertyFeature_propertyId_featureId_key" ON "PropertyFeature"("propertyId", "featureId");

-- CreateIndex
CREATE INDEX "PropertyFeature_featureId_idx" ON "PropertyFeature"("featureId");

-- AddForeignKey
ALTER TABLE "PropertyResidentialDetails" ADD CONSTRAINT "PropertyResidentialDetails_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyFeature" ADD CONSTRAINT "PropertyFeature_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyFeature" ADD CONSTRAINT "PropertyFeature_featureId_fkey" FOREIGN KEY ("featureId") REFERENCES "Feature"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Seed reusable EQUIPMENT catalog values.
INSERT INTO "Feature" (
  "id",
  "category",
  "code",
  "label",
  "isActive"
)
VALUES
  ('feature_equipment_aire_acondicionado', 'EQUIPMENT', 'AIRE_ACONDICIONADO', 'Aire acondicionado', true),
  ('feature_equipment_ventilador', 'EQUIPMENT', 'VENTILADOR', 'Ventilador', true),
  ('feature_equipment_anafe', 'EQUIPMENT', 'ANAFE', 'Anafe', true),
  ('feature_equipment_extractor_cocina', 'EQUIPMENT', 'EXTRACTOR_COCINA', 'Extractor de cocina', true),
  ('feature_equipment_calefon', 'EQUIPMENT', 'CALEFON', 'Calefón', true),
  ('feature_equipment_horno', 'EQUIPMENT', 'HORNO', 'Horno', true),
  ('feature_equipment_griferia', 'EQUIPMENT', 'GRIFERIA', 'Grifería', true),
  ('feature_equipment_placares', 'EQUIPMENT', 'PLACARES', 'Placares', true),
  ('feature_equipment_mampara_bano', 'EQUIPMENT', 'MAMPARA_BANO', 'Mampara de baño', true)
ON CONFLICT ("category", "code") DO UPDATE SET
  "label" = EXCLUDED."label",
  "isActive" = true;
