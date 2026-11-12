import {
  revalidatePath as nextRevalidatePath,
  revalidateTag as nextRevalidateTag,
} from "next/cache";

// Vencimiento inmediato. En Next 16, revalidateTag(tag, "default") marca la
// caché como vieja pero la sirve una vez más mientras regenera (stale while
// revalidate): después de guardar en la oficina virtual, la primera visita a
// la ficha seguía mostrando la versión anterior. Con expire: 0 la próxima
// visita ya trae los datos nuevos.
export function revalidateTag(tag: string) {
  return nextRevalidateTag(tag, { expire: 0 });
}

// Se llama después de crear, editar o borrar una propiedad, su estrategia o
// sus traducciones, para que home, listado y fichas muestren los datos nuevos.
export function revalidatePublicProperties() {
  revalidateTag("public-properties");
  // El sitemap lista las propiedades publicadas: se regenera con ellas.
  nextRevalidatePath("/sitemap.xml");
}
