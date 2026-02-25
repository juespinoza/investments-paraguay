// src/app/(virtual-office)/virtual-office/(protected)/asesores/_actions.ts
"use server";
import { softDeleteAdvisor } from "@/app/api/virtualoffice/advisors/repo";
import { revalidatePath } from "next/cache";

export async function deleteAdvisorAction(id: string) {
  await softDeleteAdvisor(id);
  revalidatePath("/virtual-office/asesores");
}
