"use server";
import {
  AdvisorCoreFormSchema,
  AdvisorLandingFormSchema,
  FormSchema,
} from "@/components/virtualoffice/advisors/schema";
import { z } from "zod";
import {
  AdvisorRepoError,
  type AdvisorWorkflowUserInput,
  createAdvisor,
  updateAdvisor,
  updateAdvisorCore,
  updateAdvisorLanding,
  softDeleteAdvisor,
} from "./repo";

export type AdvisorPayload = z.output<typeof FormSchema>;

const AdvisorWorkflowSchema = z.object({
  advisor: FormSchema,
  user: z
    .object({
      email: z.string().email(),
      password: z.string().min(8),
      name: z.string().trim().optional().nullable(),
    })
    .optional(),
});

export async function createAdvisorAction(payload: unknown) {
  try {
    const parsed = FormSchema.parse(payload);
    const created = await createAdvisor(parsed);
    return { ok: true, id: created.id };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof AdvisorRepoError
          ? error.message
          : "Error al crear el asesor.",
    };
  }
}

export async function createAdvisorWorkflowAction(payload: unknown) {
  try {
    const parsed = AdvisorWorkflowSchema.parse(payload);
    const created = await createAdvisor(
      parsed.advisor,
      parsed.user as AdvisorWorkflowUserInput | undefined,
    );
    return { ok: true, id: created.id };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof AdvisorRepoError
          ? error.message
          : "Error al crear el asesor.",
    };
  }
}

export async function updateAdvisorAction(advisorId: string, payload: unknown) {
  try {
    const parsed = FormSchema.parse(payload);
    const updated = await updateAdvisor(advisorId, parsed);
    return { ok: true, id: updated.id };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof AdvisorRepoError
          ? error.message
          : "Error al actualizar el asesor.",
    };
  }
}

export async function updateAdvisorCoreAction(
  advisorId: string,
  payload: unknown,
) {
  try {
    const parsed = AdvisorCoreFormSchema.parse(payload);
    const updated = await updateAdvisorCore(advisorId, parsed);
    return { ok: true, id: updated.id };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof AdvisorRepoError
          ? error.message
          : "Error al actualizar los datos base del asesor.",
    };
  }
}

export async function updateAdvisorLandingAction(
  advisorId: string,
  payload: unknown,
) {
  try {
    const parsed = AdvisorLandingFormSchema.parse(payload);
    const updated = await updateAdvisorLanding(advisorId, parsed);
    return { ok: true, id: updated.id };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof AdvisorRepoError
          ? error.message
          : "Error al actualizar la landing del asesor.",
    };
  }
}

export async function deleteAdvisorAction(advisorId: string) {
  try {
    await softDeleteAdvisor(advisorId);
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof AdvisorRepoError
          ? error.message
          : "Error al borrar el asesor.",
    };
  }
}
