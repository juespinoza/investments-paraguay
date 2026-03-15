import { NextResponse } from "next/server";
import { FormSchema } from "@/components/virtualoffice/advisors/schema";
import {
  AdvisorRepoError,
  getAdvisorById,
  softDeleteAdvisor,
  updateAdvisor,
} from "@/app/api/virtualoffice/advisors/repo";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;

  try {
    const advisor = await getAdvisorById(id);
    if (!advisor) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(advisor);
  } catch (error) {
    if (error instanceof AdvisorRepoError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    return NextResponse.json({ error: "Get failed" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: Params) {
  const { id } = await params;
  const body = await req.json();
  const parsed = FormSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    await updateAdvisor(id, parsed.data);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof AdvisorRepoError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  const { id } = await params;

  try {
    await softDeleteAdvisor(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof AdvisorRepoError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
