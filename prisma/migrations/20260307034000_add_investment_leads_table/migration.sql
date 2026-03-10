CREATE TABLE IF NOT EXISTS "investment_leads" (
  "id" BIGSERIAL PRIMARY KEY,
  "full_name" TEXT NOT NULL,
  "email" TEXT NULL,
  "whatsapp" TEXT NULL,
  "source_page" TEXT NULL,
  "advisor_slug" TEXT NULL,
  "property_slug" TEXT NULL,
  "notes" TEXT NULL,
  "status" TEXT NOT NULL DEFAULT 'NEW',
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "investment_leads_created_at_idx" ON "investment_leads"("created_at");
CREATE INDEX IF NOT EXISTS "investment_leads_status_idx" ON "investment_leads"("status");
CREATE INDEX IF NOT EXISTS "investment_leads_advisor_slug_idx" ON "investment_leads"("advisor_slug");
