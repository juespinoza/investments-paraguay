-- Repair the blank enum label introduced by the residential details migration.
-- Run before investment project details seeds PAYMENT_METHOD features.
-- Also tolerate databases where the label has already been corrected.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_enum
    WHERE enumtypid = '"FeatureCategory"'::regtype
      AND enumlabel = ' '
  ) THEN
    ALTER TYPE "FeatureCategory" RENAME VALUE ' ' TO 'PAYMENT_METHOD';
  ELSIF NOT EXISTS (
    SELECT 1 FROM pg_enum
    WHERE enumtypid = '"FeatureCategory"'::regtype
      AND enumlabel = 'PAYMENT_METHOD'
  ) THEN
    RAISE EXCEPTION 'FeatureCategory has neither the blank label nor PAYMENT_METHOD; inspect the enum before continuing.';
  END IF;
END $$;
