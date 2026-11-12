import {
  revalidatePath as nextRevalidatePath,
  revalidateTag as nextRevalidateTag,
} from "next/cache";

export function revalidateTag(tag: string) {
  // Next 16.1.1 requiere profile: usamos "default"
  return nextRevalidateTag(tag, "default");
}

// Se llama después de crear, editar o borrar una propiedad para que home,
// listado y fichas muestren los datos nuevos de inmediato.
export function revalidatePublicProperties() {
  revalidateTag("public-properties");
  // El sitemap lista las propiedades publicadas: se regenera con ellas.
  nextRevalidatePath("/sitemap.xml");
}
