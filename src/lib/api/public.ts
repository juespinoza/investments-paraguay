import "server-only";

export async function apiGet<T>(path: string, revalidateSeconds: number) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL;
  const res = await fetch(`${baseUrl}${path}`, {
    cache: "force-cache",
    next: { revalidate: revalidateSeconds },
  });
  if (!res.ok) return null;
  return (await res.json()) as T;
}
