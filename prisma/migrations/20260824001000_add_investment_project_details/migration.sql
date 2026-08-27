-- CreateEnum
CREATE TYPE "CompanyType" AS ENUM ('CONSTRUCTORA', 'DESARROLLADORA');

-- CreateEnum
CREATE TYPE "BalconyType" AS ENUM ('SIN_BALCON', 'CON_BALCON', 'CON_PARRILLA');

-- CreateTable
CREATE TABLE "Company" (
  "id" TEXT NOT NULL,
  "type" "CompanyType" NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "yearsExperience" INTEGER,
  "completedProjects" INTEGER,
  "ongoingProjects" INTEGER,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyInvestmentDetails" (
  "id" TEXT NOT NULL,
  "propertyId" TEXT NOT NULL,
  "constructionStartQuarter" INTEGER NOT NULL,
  "constructionStartYear" INTEGER NOT NULL,
  "constructionEndQuarter" INTEGER NOT NULL,
  "constructionEndYear" INTEGER NOT NULL,
  "constructoraId" TEXT,
  "desarrolladoraId" TEXT,
  "postSaleWarrantyYears" INTEGER,

  CONSTRAINT "PropertyInvestmentDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyTypology" (
  "id" TEXT NOT NULL,
  "propertyId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "planImageUrl" TEXT,
  "interiorAreaM2" DECIMAL(8, 2) NOT NULL,
  "exteriorAreaM2" DECIMAL(8, 2),
  "bedrooms" INTEGER NOT NULL,
  "bathrooms" INTEGER NOT NULL,
  "garages" INTEGER NOT NULL,
  "cashPrice" DECIMAL(14, 2) NOT NULL,
  "currency" "Currency" NOT NULL DEFAULT 'USD',
  "balconyType" "BalconyType" NOT NULL,
  "expensesPerM2Approx" DECIMAL(14, 2),
  "netMonthlyIncomeApprox" DECIMAL(14, 2),
  "roiCalculated" NUMERIC(12, 6) GENERATED ALWAYS AS (
    CASE
      WHEN "cashPrice" > 0 AND "netMonthlyIncomeApprox" IS NOT NULL
      THEN ("netMonthlyIncomeApprox" * 12) / "cashPrice"
      ELSE NULL
    END
  ) STORED,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "PropertyTypology_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Company_type_idx" ON "Company"("type");

-- CreateIndex
CREATE INDEX "Company_name_idx" ON "Company"("name");

-- CreateIndex
CREATE UNIQUE INDEX "PropertyInvestmentDetails_propertyId_key" ON "PropertyInvestmentDetails"("propertyId");

-- CreateIndex
CREATE INDEX "PropertyInvestmentDetails_constructoraId_idx" ON "PropertyInvestmentDetails"("constructoraId");

-- CreateIndex
CREATE INDEX "PropertyInvestmentDetails_desarrolladoraId_idx" ON "PropertyInvestmentDetails"("desarrolladoraId");

-- CreateIndex
CREATE INDEX "PropertyTypology_propertyId_idx" ON "PropertyTypology"("propertyId");

-- AddCheck
ALTER TABLE "PropertyInvestmentDetails" ADD CONSTRAINT "PropertyInvestmentDetails_constructionStartQuarter_check" CHECK ("constructionStartQuarter" BETWEEN 1 AND 4);

-- AddCheck
ALTER TABLE "PropertyInvestmentDetails" ADD CONSTRAINT "PropertyInvestmentDetails_constructionEndQuarter_check" CHECK ("constructionEndQuarter" BETWEEN 1 AND 4);

-- AddForeignKey
ALTER TABLE "PropertyInvestmentDetails" ADD CONSTRAINT "PropertyInvestmentDetails_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyInvestmentDetails" ADD CONSTRAINT "PropertyInvestmentDetails_constructoraId_fkey" FOREIGN KEY ("constructoraId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyInvestmentDetails" ADD CONSTRAINT "PropertyInvestmentDetails_desarrolladoraId_fkey" FOREIGN KEY ("desarrolladoraId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyTypology" ADD CONSTRAINT "PropertyTypology_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Seed reusable feature catalog values for investment projects.
INSERT INTO "Feature" (
  "id",
  "category",
  "code",
  "label",
  "isActive"
)
VALUES
  ('feature_amenity_piscina', 'AMENITY', 'PISCINA', 'Piscina', true),
  ('feature_amenity_coworking', 'AMENITY', 'COWORKING', 'Coworking', true),
  ('feature_amenity_lavanderia', 'AMENITY', 'LAVANDERIA', 'Lavandería', true),
  ('feature_amenity_gimnasio', 'AMENITY', 'GIMNASIO', 'Gimnasio', true),
  ('feature_amenity_solarium', 'AMENITY', 'SOLARIUM', 'Solarium', true),
  ('feature_amenity_quincho_techado', 'AMENITY', 'QUINCHO_TECHADO', 'Quincho techado', true),
  ('feature_amenity_quincho_aire_libre', 'AMENITY', 'QUINCHO_AIRE_LIBRE', 'Quincho al aire libre', true),
  ('feature_security_conserjeria_24_7', 'SECURITY', 'CONSERJERIA_24_7', 'Conserjería 24/7', true),
  ('feature_security_camaras', 'SECURITY', 'CAMARAS', 'Cámaras', true),
  ('feature_security_control_acceso', 'SECURITY', 'CONTROL_ACCESO', 'Control de acceso', true),
  ('feature_general_service_fibra_optica', 'GENERAL_SERVICE', 'FIBRA_OPTICA', 'Fibra óptica', true),
  ('feature_general_service_tipo_energia', 'GENERAL_SERVICE', 'TIPO_ENERGIA', 'Tipo de energía', true),
  ('feature_general_service_generador_emergencia', 'GENERAL_SERVICE', 'GENERADOR_EMERGENCIA', 'Generador de emergencia', true),
  ('feature_general_service_administracion_propia', 'GENERAL_SERVICE', 'ADMINISTRACION_PROPIA', 'Administración propia', true),
  ('feature_payment_method_efectivo', 'PAYMENT_METHOD', 'EFECTIVO', 'Efectivo', true),
  ('feature_payment_method_tarjeta_debito', 'PAYMENT_METHOD', 'TARJETA_DEBITO', 'Tarjeta de débito', true),
  ('feature_payment_method_tarjeta_credito', 'PAYMENT_METHOD', 'TARJETA_CREDITO', 'Tarjeta de crédito', true),
  ('feature_payment_method_transferencia_nacional', 'PAYMENT_METHOD', 'TRANSFERENCIA_NACIONAL', 'Transferencia nacional', true),
  ('feature_payment_method_transferencia_internacional', 'PAYMENT_METHOD', 'TRANSFERENCIA_INTERNACIONAL', 'Transferencia internacional', true),
  ('feature_payment_method_billetera_digital', 'PAYMENT_METHOD', 'BILLETERA_DIGITAL', 'Billetera digital', true),
  ('feature_payment_method_criptomoneda', 'PAYMENT_METHOD', 'CRIPTOMONEDA', 'Criptomoneda', true),
  ('feature_financing_type_propia', 'FINANCING_TYPE', 'PROPIA', 'Propia', true),
  ('feature_financing_type_via_banco', 'FINANCING_TYPE', 'VIA_BANCO', 'Vía banco', true),
  ('feature_financing_type_che_ropa_pora', 'FINANCING_TYPE', 'CHE_ROPA_PORA', 'Che Róga Porã', true),
  ('feature_financing_type_afd', 'FINANCING_TYPE', 'AFD', 'AFD', true),
  ('feature_required_document_id', 'REQUIRED_DOCUMENT', 'ID', 'Documento de identidad', true),
  ('feature_required_document_comprobante_ingresos', 'REQUIRED_DOCUMENT', 'COMPROBANTE_INGRESOS', 'Comprobante de ingresos', true)
ON CONFLICT ("category", "code") DO UPDATE SET
  "label" = EXCLUDED."label",
  "isActive" = true;
