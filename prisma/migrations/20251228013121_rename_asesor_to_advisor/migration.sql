DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'Asesor'
  ) THEN
    ALTER TABLE "Asesor" RENAME TO "Advisor";
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'AsesorTestimonial'
  ) THEN
    ALTER TABLE "AsesorTestimonial" RENAME TO "AdvisorTestimonial";
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'AsesorSocialLink'
  ) THEN
    ALTER TABLE "AsesorSocialLink" RENAME TO "AdvisorSocialLink";
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'Property'
      AND column_name = 'asesorId'
  ) THEN
    ALTER TABLE "Property" RENAME COLUMN "asesorId" TO "advisorId";
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'BlogPost'
      AND column_name = 'asesorId'
  ) THEN
    ALTER TABLE "BlogPost" RENAME COLUMN "asesorId" TO "advisorId";
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'User'
      AND column_name = 'asesorId'
  ) THEN
    ALTER TABLE "User" RENAME COLUMN "asesorId" TO "advisorId";
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'LandingAdvisor'
      AND column_name = 'asesorId'
  ) THEN
    ALTER TABLE "LandingAdvisor" RENAME COLUMN "asesorId" TO "advisorId";
  END IF;

  IF EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'Property_asesorId_fkey'
  ) THEN
    ALTER TABLE "Property"
      RENAME CONSTRAINT "Property_asesorId_fkey" TO "Property_advisorId_fkey";
  END IF;

  IF EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'BlogPost_asesorId_fkey'
  ) THEN
    ALTER TABLE "BlogPost"
      RENAME CONSTRAINT "BlogPost_asesorId_fkey" TO "BlogPost_advisorId_fkey";
  END IF;

  IF EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'LandingAdvisor_asesorId_fkey'
  ) THEN
    ALTER TABLE "LandingAdvisor"
      RENAME CONSTRAINT "LandingAdvisor_asesorId_fkey" TO "LandingAdvisor_advisorId_fkey";
  END IF;

  IF EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'AsesorTestimonial_landingId_fkey'
  ) THEN
    ALTER TABLE "AdvisorTestimonial"
      RENAME CONSTRAINT "AsesorTestimonial_landingId_fkey"
      TO "AdvisorTestimonial_landingId_fkey";
  END IF;

  IF EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'AsesorSocialLink_landingId_fkey'
  ) THEN
    ALTER TABLE "AdvisorSocialLink"
      RENAME CONSTRAINT "AsesorSocialLink_landingId_fkey"
      TO "AdvisorSocialLink_landingId_fkey";
  END IF;
END $$;
