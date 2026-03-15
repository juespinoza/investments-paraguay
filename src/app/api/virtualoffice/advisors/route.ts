import { NextResponse } from "next/server";
import { FormSchema } from "@/components/virtualoffice/advisors/schema";
import {
  AdvisorRepoError,
  createAdvisor,
  listAdvisors,
} from "@/app/api/virtualoffice/advisors/repo";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = (url.searchParams.get("q") ?? "").trim();
  const take = Number(url.searchParams.get("take") ?? "20");

  try {
    const items = await listAdvisors({ q, take });
    return NextResponse.json({ items });
  } catch (error) {
    if (error instanceof AdvisorRepoError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    return NextResponse.json({ error: "List failed" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = FormSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const created = await createAdvisor(parsed.data);
    return NextResponse.json({ id: created.id }, { status: 201 });
  } catch (error) {
    if (error instanceof AdvisorRepoError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    return NextResponse.json({ error: "Create failed" }, { status: 500 });
  }
}
