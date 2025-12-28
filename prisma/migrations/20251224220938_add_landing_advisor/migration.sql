-- CreateEnum
CREATE TYPE "SocialPlatform" AS ENUM ('WHATSAPP', 'EMAIL', 'BLOG', 'WEB', 'INSTAGRAM', 'FACEBOOK', 'X', 'TIKTOK');

-- AlterTable
ALTER TABLE "Asesor" ADD COLUMN     "ctaHref" TEXT,
ADD COLUMN     "ctaLabel" TEXT,
ADD COLUMN     "headline" TEXT,
ADD COLUMN     "heroBgUrl" TEXT,
ADD COLUMN     "inmobiliariaId" TEXT;

-- CreateTable
CREATE TABLE "LandingAdvisor" (
    "id" TEXT NOT NULL,
    "asesorId" TEXT NOT NULL,
    "aboutImageUrl" TEXT NOT NULL,
    "aboutTitle" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "company" TEXT NOT NULL,
    "aboutDescription" TEXT,
    "aboutParagraph1" TEXT NOT NULL,
    "aboutParagraph2" TEXT NOT NULL,
    "servicesParagraph1" TEXT NOT NULL,
    "servicesParagraph2" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "LandingAdvisor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LandingAdvisorPropertyType" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "landingId" TEXT NOT NULL,

    CONSTRAINT "LandingAdvisorPropertyType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LandingAdvisorClientType" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "landingId" TEXT NOT NULL,

    CONSTRAINT "LandingAdvisorClientType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LandingAdvisorArea" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "landingId" TEXT NOT NULL,

    CONSTRAINT "LandingAdvisorArea_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LandingAdvisorServiceItem" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "landingId" TEXT NOT NULL,

    CONSTRAINT "LandingAdvisorServiceItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LandingAdvisorFeaturedProperty" (
    "id" TEXT NOT NULL,
    "landingId" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "LandingAdvisorFeaturedProperty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AsesorTestimonial" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "landingId" TEXT NOT NULL,

    CONSTRAINT "AsesorTestimonial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AsesorSocialLink" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "href" TEXT NOT NULL,
    "platform" "SocialPlatform" NOT NULL,
    "landingId" TEXT NOT NULL,

    CONSTRAINT "AsesorSocialLink_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LandingAdvisor_asesorId_key" ON "LandingAdvisor"("asesorId");

-- CreateIndex
CREATE INDEX "LandingAdvisorPropertyType_landingId_idx" ON "LandingAdvisorPropertyType"("landingId");

-- CreateIndex
CREATE INDEX "LandingAdvisorClientType_landingId_idx" ON "LandingAdvisorClientType"("landingId");

-- CreateIndex
CREATE INDEX "LandingAdvisorArea_landingId_idx" ON "LandingAdvisorArea"("landingId");

-- CreateIndex
CREATE INDEX "LandingAdvisorServiceItem_landingId_idx" ON "LandingAdvisorServiceItem"("landingId");

-- CreateIndex
CREATE INDEX "LandingAdvisorFeaturedProperty_landingId_idx" ON "LandingAdvisorFeaturedProperty"("landingId");

-- CreateIndex
CREATE UNIQUE INDEX "LandingAdvisorFeaturedProperty_landingId_propertyId_key" ON "LandingAdvisorFeaturedProperty"("landingId", "propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "LandingAdvisorFeaturedProperty_landingId_order_key" ON "LandingAdvisorFeaturedProperty"("landingId", "order");

-- CreateIndex
CREATE INDEX "AsesorTestimonial_landingId_idx" ON "AsesorTestimonial"("landingId");

-- CreateIndex
CREATE INDEX "AsesorSocialLink_landingId_idx" ON "AsesorSocialLink"("landingId");

-- AddForeignKey
ALTER TABLE "Asesor" ADD CONSTRAINT "Asesor_inmobiliariaId_fkey" FOREIGN KEY ("inmobiliariaId") REFERENCES "Inmobiliaria"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LandingAdvisor" ADD CONSTRAINT "LandingAdvisor_asesorId_fkey" FOREIGN KEY ("asesorId") REFERENCES "Asesor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LandingAdvisorPropertyType" ADD CONSTRAINT "LandingAdvisorPropertyType_landingId_fkey" FOREIGN KEY ("landingId") REFERENCES "LandingAdvisor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LandingAdvisorClientType" ADD CONSTRAINT "LandingAdvisorClientType_landingId_fkey" FOREIGN KEY ("landingId") REFERENCES "LandingAdvisor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LandingAdvisorArea" ADD CONSTRAINT "LandingAdvisorArea_landingId_fkey" FOREIGN KEY ("landingId") REFERENCES "LandingAdvisor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LandingAdvisorServiceItem" ADD CONSTRAINT "LandingAdvisorServiceItem_landingId_fkey" FOREIGN KEY ("landingId") REFERENCES "LandingAdvisor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LandingAdvisorFeaturedProperty" ADD CONSTRAINT "LandingAdvisorFeaturedProperty_landingId_fkey" FOREIGN KEY ("landingId") REFERENCES "LandingAdvisor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LandingAdvisorFeaturedProperty" ADD CONSTRAINT "LandingAdvisorFeaturedProperty_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AsesorTestimonial" ADD CONSTRAINT "AsesorTestimonial_landingId_fkey" FOREIGN KEY ("landingId") REFERENCES "LandingAdvisor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AsesorSocialLink" ADD CONSTRAINT "AsesorSocialLink_landingId_fkey" FOREIGN KEY ("landingId") REFERENCES "LandingAdvisor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
