"use server";
import { FormSchema } from "@/components/virtualoffice/advisors/schema";
import type { z } from "zod";
import { createAdvisor, updateAdvisor, softDeleteAdvisor } from "./repo";
import { use } from "react";

export type AdvisorPayload = z.output<typeof FormSchema>;

export async function createAdvisorAction(payload: unknown) {
  try {
    const parsed = FormSchema.parse(payload); // valida + normaliza
    const created = await createAdvisor(parsed);
    return { ok: true, id: created.id };
  } catch (error) {
    return { ok: false, error: "Error al crear el asesor." };
  }
}

export async function updateAdvisorAction(advisorId: string, payload: unknown) {
  try {
    const parsed = FormSchema.parse(payload);
    const updated = await updateAdvisor(advisorId, parsed);
    return { ok: true, id: updated.id };
  } catch (error) {
    return { ok: false, error: "Error al actualizar el asesor." };
  }
}

export async function deleteAdvisorAction(advisorId: string) {
  try {
    await softDeleteAdvisor(advisorId);
    return { ok: true };
  } catch (error) {
    return { ok: false, error: "Error al borrar el asesor." };
  }
}
