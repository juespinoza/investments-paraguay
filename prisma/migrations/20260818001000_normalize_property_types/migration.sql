-- CreateTable
CREATE TABLE "PropertyType" (
  "id" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "label" TEXT NOT NULL,
  "isProject" BOOLEAN NOT NULL DEFAULT false,
  "hasResidentialDetails" BOOLEAN NOT NULL DEFAULT false,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "PropertyType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PropertyType_code_key" ON "PropertyType"("code");

-- Seed catalog required by the data migration below.
INSERT INTO "PropertyType" (
  "id",
  "code",
  "label",
  "isProject",
  "hasResidentialDetails",
  "isActive",
  "createdAt",
  "updatedAt"
)
VALUES
  ('pt_casa_duplex', 'CASA_DUPLEX', 'Casa/Dúplex', false, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('pt_departamento', 'DEPARTAMENTO', 'Departamento', false, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('pt_terreno_lote', 'TERRENO_LOTE', 'Terreno/Lote', false, false, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('pt_rural_chacra', 'RURAL_CHACRA', 'Rural/Chacra', false, false, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('pt_quinta', 'QUINTA', 'Quinta', false, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('pt_local_comercial', 'LOCAL_COMERCIAL', 'Local comercial', false, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('pt_deposito', 'DEPOSITO', 'Depósito', false, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('pt_oficina', 'OFICINA', 'Oficina', false, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('pt_galpon_industrial', 'GALPON_INDUSTRIAL', 'Galpón industrial', false, false, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('pt_edificio_departamentos', 'EDIFICIO_DEPARTAMENTOS', 'Edificio de departamentos', true, false, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('pt_edificio_oficinas', 'EDIFICIO_OFICINAS', 'Edificio de oficinas', true, false, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('pt_edificio_comercial', 'EDIFICIO_COMERCIAL', 'Edificio comercial', true, false, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('pt_loteamiento', 'LOTEAMIENTO', 'Loteamiento', true, false, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('pt_complejo_casas_duplex', 'COMPLEJO_CASAS_DUPLEX', 'Complejo de casas/dúplex', true, false, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("code") DO UPDATE SET
  "label" = EXCLUDED."label",
  "isProject" = EXCLUDED."isProject",
  "hasResidentialDetails" = EXCLUDED."hasResidentialDetails",
  "isActive" = true,
  "updatedAt" = CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Property" ADD COLUMN "propertyTypeId" TEXT;

-- Backfill propertyTypeId from the previous free-text propertyType column.
UPDATE "Property" AS p
SET "propertyTypeId" = pt."id"
FROM "PropertyType" AS pt
WHERE pt."code" = CASE
  WHEN p."propertyType" IS NULL OR btrim(p."propertyType") = '' THEN NULL
  WHEN translate(lower(p."propertyType"), 'áéíóúüñ', 'aeiouun') LIKE '%complejo%' AND translate(lower(p."propertyType"), 'áéíóúüñ', 'aeiouun') LIKE ANY (ARRAY['%casa%', '%duplex%']) THEN 'COMPLEJO_CASAS_DUPLEX'
  WHEN translate(lower(p."propertyType"), 'áéíóúüñ', 'aeiouun') LIKE '%edificio%' AND translate(lower(p."propertyType"), 'áéíóúüñ', 'aeiouun') LIKE ANY (ARRAY['%departamento%', '%depto%', '%apartamento%']) THEN 'EDIFICIO_DEPARTAMENTOS'
  WHEN translate(lower(p."propertyType"), 'áéíóúüñ', 'aeiouun') LIKE '%edificio%' AND translate(lower(p."propertyType"), 'áéíóúüñ', 'aeiouun') LIKE '%oficina%' THEN 'EDIFICIO_OFICINAS'
  WHEN translate(lower(p."propertyType"), 'áéíóúüñ', 'aeiouun') LIKE '%edificio%' AND translate(lower(p."propertyType"), 'áéíóúüñ', 'aeiouun') LIKE '%comercial%' THEN 'EDIFICIO_COMERCIAL'
  WHEN translate(lower(p."propertyType"), 'áéíóúüñ', 'aeiouun') LIKE '%loteamiento%' THEN 'LOTEAMIENTO'
  WHEN translate(lower(p."propertyType"), 'áéíóúüñ', 'aeiouun') LIKE ANY (ARRAY['%galpon%', '%industrial%']) THEN 'GALPON_INDUSTRIAL'
  WHEN translate(lower(p."propertyType"), 'áéíóúüñ', 'aeiouun') LIKE '%local%' THEN 'LOCAL_COMERCIAL'
  WHEN translate(lower(p."propertyType"), 'áéíóúüñ', 'aeiouun') LIKE '%oficina%' THEN 'OFICINA'
  WHEN translate(lower(p."propertyType"), 'áéíóúüñ', 'aeiouun') LIKE '%proyecto%' THEN 'EDIFICIO_DEPARTAMENTOS'
  WHEN translate(lower(p."propertyType"), 'áéíóúüñ', 'aeiouun') LIKE ANY (ARRAY['%quinta%']) THEN 'QUINTA'
  WHEN translate(lower(p."propertyType"), 'áéíóúüñ', 'aeiouun') LIKE ANY (ARRAY['%rural%', '%campo%', '%estancia%','%quinta%', '%chacra%']) THEN 'RURAL_CHACRA'
  WHEN translate(lower(p."propertyType"), 'áéíóúüñ', 'aeiouun') LIKE ANY (ARRAY['%terreno%', '%lote%']) THEN 'TERRENO_LOTE'
  WHEN translate(lower(p."propertyType"), 'áéíóúüñ', 'aeiouun') LIKE ANY (ARRAY['%casa%', '%duplex%']) THEN 'CASA_DUPLEX'
  WHEN translate(lower(p."propertyType"), 'áéíóúüñ', 'aeiouun') LIKE ANY (ARRAY['%departamento%', '%depto%', '%apartamento%', '%loft%', '%apart-hotel%', '%aparthotel%']) THEN 'DEPARTAMENTO'
  ELSE NULL
END;

DO $$
DECLARE
  unmatched RECORD;
  unmatched_count INTEGER := 0;
BEGIN
  FOR unmatched IN
    SELECT "id", "slug", "title", "propertyType"
    FROM "Property"
    WHERE "propertyTypeId" IS NULL
    ORDER BY "createdAt" ASC
  LOOP
    unmatched_count := unmatched_count + 1;
    RAISE NOTICE 'Unmatched Property.propertyType: id=%, slug=%, title=%, propertyType=%',
      unmatched."id",
      unmatched."slug",
      unmatched."title",
      unmatched."propertyType";
  END LOOP;

  IF unmatched_count > 0 THEN
    RAISE EXCEPTION 'Property type normalization stopped: % properties could not be mapped. Review the NOTICE rows and add explicit mappings before applying this migration.', unmatched_count;
  END IF;
END $$;

-- AlterTable
ALTER TABLE "Property" ALTER COLUMN "propertyTypeId" SET NOT NULL;

-- CreateIndex
CREATE INDEX "Property_propertyTypeId_idx" ON "Property"("propertyTypeId");

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_propertyTypeId_fkey" FOREIGN KEY ("propertyTypeId") REFERENCES "PropertyType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Drop the old free-text column after every row is safely mapped.
ALTER TABLE "Property" DROP COLUMN "propertyType";
