-- 1️⃣ Renombrar tablas principales
ALTER TABLE "Asesor" RENAME TO "Advisor";
ALTER TABLE "AsesorTestimonial" RENAME TO "AdvisorTestimonial";
ALTER TABLE "AsesorSocialLink" RENAME TO "AdvisorSocialLink";

-- 2️⃣ Renombrar columnas FK en tablas relacionadas
ALTER TABLE "Property" RENAME COLUMN "asesorId" TO "advisorId";
ALTER TABLE "BlogPost" RENAME COLUMN "asesorId" TO "advisorId";
ALTER TABLE "User" RENAME COLUMN "asesorId" TO "advisorId";
ALTER TABLE "LandingAdvisor" RENAME COLUMN "asesorId" TO "advisorId";

-- 3️⃣ Renombrar constraints FK (opcional pero recomendado)
ALTER TABLE "Property"
  RENAME CONSTRAINT "Property_asesorId_fkey" TO "Property_advisorId_fkey";

ALTER TABLE "BlogPost"
  RENAME CONSTRAINT "BlogPost_asesorId_fkey" TO "BlogPost_advisorId_fkey";

ALTER TABLE "LandingAdvisor"
  RENAME CONSTRAINT "LandingAdvisor_asesorId_fkey" TO "LandingAdvisor_advisorId_fkey";

-- 4️⃣ Renombrar constraints en testimonios y social links
ALTER TABLE "AdvisorTestimonial"
  RENAME CONSTRAINT "AsesorTestimonial_landingId_fkey"
  TO "AdvisorTestimonial_landingId_fkey";

ALTER TABLE "AdvisorSocialLink"
  RENAME CONSTRAINT "AsesorSocialLink_landingId_fkey"
  TO "AdvisorSocialLink_landingId_fkey";