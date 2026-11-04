-- CreateEnum
CREATE TYPE "Supercategory" AS ENUM ('CONOCER', 'VIVIR', 'INVERTIR');

-- CreateTable
CREATE TABLE "PropertyCategory" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "category" "Supercategory" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PropertyCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PropertyCategory_propertyId_category_key" ON "PropertyCategory"("propertyId", "category");

-- CreateIndex
CREATE INDEX "PropertyCategory_category_idx" ON "PropertyCategory"("category");

-- AddForeignKey
ALTER TABLE "PropertyCategory" ADD CONSTRAINT "PropertyCategory_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;
