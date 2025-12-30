import "server-only";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";

export async function requireSession(nextPath?: string) {
  const session = await getSession();
  if (!session) {
    const next = nextPath ? `?next=${encodeURIComponent(nextPath)}` : "";
    redirect(`/virtual-office/login${next}`);
  }
  return session;
}
