"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  assignAdvisorToInmobiliaria,
  assignUserToInmobiliaria,
  InmobiliariaRepoError,
  unassignAdvisorFromInmobiliaria,
  unassignUserFromInmobiliaria,
} from "@/lib/virtualoffice/inmobiliarias";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function buildEditUrl(id: string, params: Record<string, string>) {
  const search = new URLSearchParams(params);
  return `/virtual-office/inmobiliaria/${id}/edit?${search.toString()}`;
}

function revalidateInmobiliariaPaths(id: string) {
  revalidatePath("/virtual-office/inmobiliaria");
  revalidatePath(`/virtual-office/inmobiliaria/${id}/edit`);
  revalidatePath("/virtual-office/usuarios");
  revalidatePath("/virtual-office/asesores");
  revalidatePath("/virtual-office/propiedades");
}

export async function assignInmobiliariaUserAction(
  inmobiliariaId: string,
  formData: FormData,
) {
  const userId = getString(formData, "userId");

  if (!userId) {
    redirect(
      buildEditUrl(inmobiliariaId, {
        error: "Selecciona un usuario para vincular.",
      }),
    );
  }

  try {
    await assignUserToInmobiliaria(inmobiliariaId, userId);
    revalidateInmobiliariaPaths(inmobiliariaId);
    redirect(
      buildEditUrl(inmobiliariaId, {
        status: "user-assigned",
      }),
    );
  } catch (error) {
    const message =
      error instanceof InmobiliariaRepoError
        ? error.message
        : "No se pudo vincular el usuario.";
    redirect(
      buildEditUrl(inmobiliariaId, {
        error: message,
      }),
    );
  }
}

export async function unassignInmobiliariaUserAction(
  inmobiliariaId: string,
  formData: FormData,
) {
  const userId = getString(formData, "userId");

  if (!userId) {
    redirect(
      buildEditUrl(inmobiliariaId, {
        error: "Usuario inválido.",
      }),
    );
  }

  try {
    await unassignUserFromInmobiliaria(inmobiliariaId, userId);
    revalidateInmobiliariaPaths(inmobiliariaId);
    redirect(
      buildEditUrl(inmobiliariaId, {
        status: "user-unassigned",
      }),
    );
  } catch (error) {
    const message =
      error instanceof InmobiliariaRepoError
        ? error.message
        : "No se pudo desvincular el usuario.";
    redirect(
      buildEditUrl(inmobiliariaId, {
        error: message,
      }),
    );
  }
}

export async function assignAdvisorToInmobiliariaAction(
  inmobiliariaId: string,
  formData: FormData,
) {
  const advisorId = getString(formData, "advisorId");

  if (!advisorId) {
    redirect(
      buildEditUrl(inmobiliariaId, {
        error: "Selecciona un asesor para vincular.",
      }),
    );
  }

  try {
    await assignAdvisorToInmobiliaria(inmobiliariaId, advisorId);
    revalidateInmobiliariaPaths(inmobiliariaId);
    redirect(
      buildEditUrl(inmobiliariaId, {
        status: "advisor-assigned",
      }),
    );
  } catch (error) {
    const message =
      error instanceof InmobiliariaRepoError
        ? error.message
        : "No se pudo vincular el asesor.";
    redirect(
      buildEditUrl(inmobiliariaId, {
        error: message,
      }),
    );
  }
}

export async function unassignAdvisorFromInmobiliariaAction(
  inmobiliariaId: string,
  formData: FormData,
) {
  const advisorId = getString(formData, "advisorId");

  if (!advisorId) {
    redirect(
      buildEditUrl(inmobiliariaId, {
        error: "Asesor inválido.",
      }),
    );
  }

  try {
    await unassignAdvisorFromInmobiliaria(inmobiliariaId, advisorId);
    revalidateInmobiliariaPaths(inmobiliariaId);
    redirect(
      buildEditUrl(inmobiliariaId, {
        status: "advisor-unassigned",
      }),
    );
  } catch (error) {
    const message =
      error instanceof InmobiliariaRepoError
        ? error.message
        : "No se pudo desvincular el asesor.";
    redirect(
      buildEditUrl(inmobiliariaId, {
        error: message,
      }),
    );
  }
}
