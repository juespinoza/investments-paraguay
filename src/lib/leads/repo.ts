import "server-only";
import { prisma } from "@/lib/prisma";

export type LeadStatus = "NEW" | "CONTACTED" | "QUALIFIED" | "CLOSED" | "LOST";

export type LeadInput = {
  fullName: string;
  email?: string | null;
  whatsapp?: string | null;
  sourcePage?: string | null;
  advisorSlug?: string | null;
  propertySlug?: string | null;
  notes?: string | null;
};

export type LeadRow = {
  id: number;
  full_name: string;
  email: string | null;
  whatsapp: string | null;
  source_page: string | null;
  advisor_slug: string | null;
  property_slug: string | null;
  notes: string | null;
  status: LeadStatus;
  created_at: Date;
  updated_at: Date;
};

async function ensureLeadsTable() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS investment_leads (
      id BIGSERIAL PRIMARY KEY,
      full_name TEXT NOT NULL,
      email TEXT NULL,
      whatsapp TEXT NULL,
      source_page TEXT NULL,
      advisor_slug TEXT NULL,
      property_slug TEXT NULL,
      notes TEXT NULL,
      status TEXT NOT NULL DEFAULT 'NEW',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
}

export async function createLead(input: LeadInput): Promise<number> {
  await ensureLeadsTable();
  const rows = await prisma.$queryRawUnsafe<Array<{ id: number }>>(
    `
    INSERT INTO investment_leads (
      full_name,
      email,
      whatsapp,
      source_page,
      advisor_slug,
      property_slug,
      notes,
      status
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,'NEW')
    RETURNING id;
  `,
    input.fullName,
    input.email ?? null,
    input.whatsapp ?? null,
    input.sourcePage ?? null,
    input.advisorSlug ?? null,
    input.propertySlug ?? null,
    input.notes ?? null,
  );
  return rows[0]?.id ?? 0;
}

export async function listLeads(filters?: {
  advisorSlugs?: string[];
  status?: LeadStatus;
  take?: number;
}): Promise<LeadRow[]> {
  await ensureLeadsTable();
  const take = Math.min(filters?.take ?? 200, 500);

  if (filters?.advisorSlugs && filters.advisorSlugs.length > 0) {
    const rows = await prisma.$queryRawUnsafe<LeadRow[]>(
      `
      SELECT *
      FROM investment_leads
      WHERE advisor_slug = ANY($1)
      ${filters.status ? "AND status = $2" : ""}
      ORDER BY created_at DESC
      LIMIT ${take};
    `,
      filters.advisorSlugs,
      ...(filters.status ? [filters.status] : []),
    );
    return rows;
  }

  const rows = await prisma.$queryRawUnsafe<LeadRow[]>(
    `
    SELECT *
    FROM investment_leads
    ${filters?.status ? "WHERE status = $1" : ""}
    ORDER BY created_at DESC
    LIMIT ${take};
  `,
    ...(filters?.status ? [filters.status] : []),
  );

  return rows;
}

export async function updateLeadStatus(id: number, status: LeadStatus) {
  await ensureLeadsTable();
  await prisma.$executeRawUnsafe(
    `
    UPDATE investment_leads
    SET status = $2, updated_at = NOW()
    WHERE id = $1;
  `,
    id,
    status,
  );
}
