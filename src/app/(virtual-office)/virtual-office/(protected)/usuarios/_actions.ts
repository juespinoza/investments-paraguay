"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Role } from "@/generated/prisma";
import {
  UserRepoError,
  createUser,
  softDeleteUser,
  updateUser,
  updateUserPassword,
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

    await createUser({
      email: getString(formData, "email"),
      password: getString(formData, "password"),
      name: getOptionalString(formData, "name"),
      role,
      inmobiliariaId: getOptionalString(formData, "inmobiliariaId"),
      advisorId: getOptionalString(formData, "advisorId"),
    });

    revalidatePath("/virtual-office/usuarios");
    redirect("/virtual-office/usuarios?status=created");
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

    await updateUser(id, {
      email: getString(formData, "email"),
      name: getOptionalString(formData, "name"),
      role,
      inmobiliariaId: getOptionalString(formData, "inmobiliariaId"),
      advisorId: getOptionalString(formData, "advisorId"),
    });

    revalidatePath("/virtual-office/usuarios");
    revalidatePath(`/virtual-office/usuarios/${id}/edit`);
    redirect(`/virtual-office/usuarios/${id}/edit?status=updated`);
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

export async function updateUserPasswordAction(id: string, formData: FormData) {
  try {
    const password = getString(formData, "password");
    const confirmPassword = getString(formData, "confirmPassword");

    if (password !== confirmPassword) {
      redirect(
        `/virtual-office/usuarios/${id}/edit?error=${encodeURIComponent(
          "Las contraseñas no coinciden.",
        )}`,
      );
    }

    await updateUserPassword(id, password);
    revalidatePath(`/virtual-office/usuarios/${id}/edit`);
    redirect(`/virtual-office/usuarios/${id}/edit?status=password-updated`);
  } catch (error) {
    const message =
      error instanceof UserRepoError
        ? error.message
        : "No se pudo actualizar la contraseña.";
    redirect(
      `/virtual-office/usuarios/${id}/edit?error=${encodeURIComponent(message)}`,
    );
  }
}
