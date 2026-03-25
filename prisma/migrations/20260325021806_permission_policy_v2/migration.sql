/*
  Warnings:

  - You are about to drop the `investment_leads` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "BlogOwnerType" AS ENUM ('ADMIN', 'INMOBILIARIA', 'ADVISOR', 'BLOGGER');

-- AlterTable
ALTER TABLE "Advisor" RENAME CONSTRAINT "Asesor_pkey" TO "Advisor_pkey";

-- AlterTable
ALTER TABLE "AdvisorSocialLink" RENAME CONSTRAINT "AsesorSocialLink_pkey" TO "AdvisorSocialLink_pkey";

-- AlterTable
ALTER TABLE "AdvisorTestimonial" RENAME CONSTRAINT "AsesorTestimonial_pkey" TO "AdvisorTestimonial_pkey";

-- AlterTable
ALTER TABLE "BlogPost" ADD COLUMN     "ownerId" TEXT,
ADD COLUMN     "ownerType" "BlogOwnerType";

-- DropTable
DROP TABLE "investment_leads";

-- CreateTable
CREATE TABLE "InmobiliariaLanding" (
    "id" TEXT NOT NULL,
    "inmobiliariaId" TEXT NOT NULL,
    "themeJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "InmobiliariaLanding_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InmobiliariaLanding_inmobiliariaId_key" ON "InmobiliariaLanding"("inmobiliariaId");

-- CreateIndex
CREATE INDEX "BlogPost_ownerType_ownerId_idx" ON "BlogPost"("ownerType", "ownerId");

-- CreateIndex
CREATE INDEX "BlogPost_authorRole_idx" ON "BlogPost"("authorRole");

-- RenameForeignKey
ALTER TABLE "Advisor" RENAME CONSTRAINT "Asesor_inmobiliariaId_fkey" TO "Advisor_inmobiliariaId_fkey";

-- AddForeignKey
ALTER TABLE "InmobiliariaLanding" ADD CONSTRAINT "InmobiliariaLanding_inmobiliariaId_fkey" FOREIGN KEY ("inmobiliariaId") REFERENCES "Inmobiliaria"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "Asesor_slug_key" RENAME TO "Advisor_slug_key";

-- RenameIndex
ALTER INDEX "AsesorSocialLink_landingId_idx" RENAME TO "AdvisorSocialLink_landingId_idx";

-- RenameIndex
ALTER INDEX "AsesorTestimonial_landingId_idx" RENAME TO "AdvisorTestimonial_landingId_idx";

-- RenameIndex
ALTER INDEX "LandingAdvisor_asesorId_key" RENAME TO "LandingAdvisor_advisorId_key";
