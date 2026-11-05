"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Role } from "@/generated/prisma";
import {
  UserRepoError,
  cancelUserEmailChange,
  createUser,
  resendUserInvitation,
  softDeleteUser,
  updateUser,
  sendUserPasswordResetLink,
} from "@/lib/auth/users";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getOptionalString(formData: FormData, key: string) {
  const value = getString(formData, key);
  return value.length > 0 ? value : null;
}

export async function createUserAction(formData: FormData) {
  try {
    const rawRole = getString(formData, "role");
    const role = Role[rawRole as keyof typeof Role];

    if (!role) {
      redirect("/virtual-office/usuarios?error=Rol%20inv%C3%A1lido.");
    }

    const { invitation } = await createUser({
      email: getString(formData, "email"),
      name: getOptionalString(formData, "name"),
      role,
      inmobiliariaId: getOptionalString(formData, "inmobiliariaId"),
      advisorId: getOptionalString(formData, "advisorId"),
    });

    revalidatePath("/virtual-office/usuarios");
    redirect(`/virtual-office/usuarios?status=created&invite=${invitation}`);
  } catch (error) {
    const message =
      error instanceof UserRepoError
        ? error.message
        : "No se pudo crear el usuario.";
    redirect(`/virtual-office/usuarios?error=${encodeURIComponent(message)}`);
  }
}

export async function deleteUserAction(formData: FormData) {
  try {
    const id = getString(formData, "id");
    if (!id) {
      redirect("/virtual-office/usuarios?error=Usuario%20inv%C3%A1lido.");
    }

    await softDeleteUser(id);
    revalidatePath("/virtual-office/usuarios");
    redirect("/virtual-office/usuarios?status=deleted");
  } catch (error) {
    const message =
      error instanceof UserRepoError
        ? error.message
        : "No se pudo desactivar el usuario.";
    redirect(`/virtual-office/usuarios?error=${encodeURIComponent(message)}`);
  }
}

export async function updateUserAction(id: string, formData: FormData) {
  try {
    const rawRole = getString(formData, "role");
    const role = Role[rawRole as keyof typeof Role];

    if (!role) {
      redirect("/virtual-office/usuarios?error=Rol%20inv%C3%A1lido.");
    }

    const { emailChange } = await updateUser(id, {
      email: getString(formData, "email"),
      name: getOptionalString(formData, "name"),
      role,
      inmobiliariaId: getOptionalString(formData, "inmobiliariaId"),
      advisorId: getOptionalString(formData, "advisorId"),
    });

    revalidatePath("/virtual-office/usuarios");
    revalidatePath(`/virtual-office/usuarios/${id}/edit`);
    redirect(
      `/virtual-office/usuarios/${id}/edit?status=updated${
        emailChange ? `&emailChange=${emailChange}` : ""
      }`,
    );
  } catch (error) {
    const message =
      error instanceof UserRepoError
        ? error.message
        : "No se pudo actualizar el usuario.";
    redirect(
      `/virtual-office/usuarios/${id}/edit?error=${encodeURIComponent(message)}`,
    );
  }
}

export async function sendPasswordResetLinkAction(id: string) {
  let target: string;
  try {
    await sendUserPasswordResetLink(id);
    target = `/virtual-office/usuarios/${id}/edit?status=reset-sent`;
  } catch (error) {
    const message =
      error instanceof UserRepoError
        ? error.message
        : "No se pudo enviar el link.";
    target = `/virtual-office/usuarios/${id}/edit?error=${encodeURIComponent(message)}`;
  }
  // redirect() fuera del try: lanza una excepción interna de Next.
  redirect(target);
}

export async function resendInvitationAction(id: string) {
  let target: string;
  try {
    const result = await resendUserInvitation(id);
    target = `/virtual-office/usuarios/${id}/edit?status=invite-resent&invite=${result}`;
  } catch (error) {
    const message =
      error instanceof UserRepoError ? error.message : "No se pudo reenviar la invitación.";
    target = `/virtual-office/usuarios/${id}/edit?error=${encodeURIComponent(message)}`;
  }
  redirect(target);
}

export async function cancelEmailChangeAction(id: string) {
  let target: string;
  try {
    await cancelUserEmailChange(id);
    target = `/virtual-office/usuarios/${id}/edit?status=email-change-cancelled`;
  } catch (error) {
    const message =
      error instanceof UserRepoError ? error.message : "No se pudo cancelar el cambio.";
    target = `/virtual-office/usuarios/${id}/edit?error=${encodeURIComponent(message)}`;
  }
  redirect(target);
}
