import { revalidateTag as nextRevalidateTag } from "next/cache";

export function revalidateTag(tag: string) {
  // Next 16.1.1 requiere profile: usamos "default"
  return nextRevalidateTag(tag, "default");
}
