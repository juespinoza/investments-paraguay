import { redirect } from "next/navigation";
import { isAdvisor } from "@/lib/auth/permissions";
import { requireSession } from "@/lib/auth/require-session";

export default async function AdvisorSelfServiceLandingPage() {
  const session = await requireSession();

  if (!isAdvisor(session) || !session.advisorId) {
    redirect("/virtual-office");
  }

  redirect(`/virtual-office/asesores/${session.advisorId}/edit`);
}
