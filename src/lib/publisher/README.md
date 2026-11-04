# API del publicador de propiedades

Permite que el publicador (`publishing_machine`) cree y actualice propiedades en investmentsparaguay.com sin pasar por la oficina virtual.

**Reglas principales**

- **Toda propiedad nueva entra como `BORRADOR`.** No se ve en el sitio hasta que la revises y la publiques desde la oficina virtual.
- **El publicador nunca publica.** En una actualización solo puede pasar una propiedad a `RESERVADA`, `VENDIDA`, `ALQUILADA` o `RETIRADA`. Así puede sacarla del mercado si se vendió en el sistema de origen.
- **Reenviar es seguro.** Cada propiedad se identifica por `source` + `externalId`: el mismo envío actualiza la misma propiedad, no crea otra.
- **Lo que no se envía no se toca.** Un campo omitido conserva su valor. `null` lo borra. El estado, el slug, el destacado y lo que cargues en la oficina virtual fuera de estos campos se mantienen.
- **Las fotos se suben a tu Cloudinary.** Enviás las URLs de origen (por ejemplo, de SkyOne). Cloudinary las descarga y la propiedad queda con sus propias copias. Reenviar la misma URL no la duplica.

## Configuración (Vercel → Settings → Environment Variables)

| Variable | Obligatoria | Para qué |
| --- | --- | --- |
| `PUBLISHER_API_KEY` | Sí | Token que envía el publicador. Generalo con `openssl rand -hex 32`. Sin esta variable la API responde 503 y queda cerrada. |
| `CLOUDINARY_API_KEY` | Sí, para fotos | Credencial de la Upload API (Cloudinary → Settings → API Keys). |
| `CLOUDINARY_API_SECRET` | Sí, para fotos | Secreto de esa credencial. Nunca en el navegador ni en el repo. |
| `PUBLISHER_DEFAULT_ADVISOR_SLUG` | No | Asesor asignado por defecto a las propiedades nuevas, por ejemplo `julia-espinoza`. |

El cloud name se toma de `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, que ya existe.

## Autenticación

Todas las llamadas llevan el header:

```
Authorization: Bearer <PUBLISHER_API_KEY>
```

## Endpoints

Base: `https://www.investmentsparaguay.com/api/integrations/publisher`

| Método | Ruta | Qué hace |
| --- | --- | --- |
| `GET` | `/property-types` | Lista los códigos de tipo de propiedad válidos. |
| `PUT` | `/properties/{source}/{externalId}` | Crea la propiedad (201) o la actualiza (200). |
| `GET` | `/properties/{source}/{externalId}` | Devuelve el estado actual de la propiedad. |
| `DELETE` | `/properties/{source}/{externalId}` | La retira del sitio (`RETIRADA`, baja lógica). Un `PUT` posterior la restaura. |

- `source`: el sistema de origen, en minúsculas, por ejemplo `skyone` (2 a 40 caracteres `a-z`, `0-9`, `-`).
- `externalId`: el id de la propiedad en ese sistema (1 a 100 caracteres `A-Z`, `a-z`, `0-9`, `.`, `_`, `-`).

## Cuerpo del `PUT`

| Campo | Tipo | Notas |
| --- | --- | --- |
| `title` | string, 3–160 | **Obligatorio.** |
| `propertyTypeCode` | string | **Obligatorio al crear.** Uno de `/property-types`, por ejemplo `DEPARTAMENTO`. |
| `description` | string \| null | Admite `**negrita**`. |
| `price` | number \| null | Positivo. |
| `currency` | `"USD"` \| `"GS"` | Por defecto `USD` al crear. |
| `city` | string \| null | Para que aparezca en su landing de zona: `Asunción`, `Mariano Roque Alonso` (o `MRA`), `Luque`. |
| `neighborhood`, `address` | string \| null | |
| `locationUrl` | URL \| null | Link de Google Maps. |
| `latitude`, `longitude` | number \| null | |
| `areaM2` | number \| null | |
| `roiAnnualPct`, `appreciationAnnualPct` | number 0–100 \| null | Si no los enviás, se mantiene lo que cargues en la oficina virtual. |
| `hasPropertyDocuments` | boolean | |
| `images` | URL[] (máx. 30) | La primera es la portada. Enviar `[]` borra las fotos. Omitir el campo las mantiene. |
| `categories` | `("CONOCER"\|"VIVIR"\|"INVERTIR")[]` | |
| `advisorSlug` | string \| null | Slug del asesor. `null` lo desasigna. |
| `status` | `RESERVADA` \| `VENDIDA` \| `ALQUILADA` \| `RETIRADA` | Solo en actualizaciones. Al crear se ignora. |

Campos no listados se rechazan con 422, para detectar a tiempo un error de mapeo en el publicador.

## Respuesta

```json
{
  "created": true,
  "property": {
    "id": "cm…",
    "source": "skyone",
    "externalId": "SKY-1234",
    "slug": "campus-lofts-sky-1234",
    "title": "Campus Lofts",
    "status": "BORRADOR",
    "deleted": false,
    "imageCount": 6,
    "url": "https://www.investmentsparaguay.com/es/bienes-raices/propiedades/campus-lofts-sky-1234",
    "reviewUrl": "https://www.investmentsparaguay.com/virtual-office/propiedades/cm…/edit",
    "updatedAt": "2026-11-04T18:00:00.000Z"
  },
  "warnings": []
}
```

`warnings` lista las fotos que no se pudieron subir. La propiedad se guarda igual con las que sí subieron. Si no subió ninguna y ya tenía fotos, conserva las anteriores.

## Errores

Formato: `{ "error": { "code": "...", "message": "...", "details": ... } }`

| HTTP | `code` | Causa |
| --- | --- | --- |
| 400 | `invalid_target` | `source` o `externalId` con formato inválido. |
| 401 | `unauthorized` | Token ausente o incorrecto. |
| 404 | `not_found` | No existe esa propiedad (en `GET` o `DELETE`). |
| 422 | `invalid_payload` | El cuerpo no cumple el contrato. `details` indica qué campo. |
| 422 | `missing_property_type` | Falta `propertyTypeCode` al crear. |
| 422 | `unknown_property_type` | Código inexistente. `details.validCodes` lista los válidos. |
| 422 | `unknown_advisor` | `advisorSlug` inexistente. |
| 503 | `not_configured` | Falta `PUBLISHER_API_KEY`. |
| 503 | `images_not_configured` | Faltan las credenciales de Cloudinary y se enviaron fotos. |

## Ejemplo

```bash
curl -X PUT "https://www.investmentsparaguay.com/api/integrations/publisher/properties/skyone/SKY-1234" \
  -H "Authorization: Bearer $PUBLISHER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Campus Lofts",
    "propertyTypeCode": "DEPARTAMENTO",
    "price": 46500,
    "currency": "USD",
    "city": "Mariano Roque Alonso",
    "neighborhood": "San Blás",
    "areaM2": 28,
    "description": "Monoambiente amoblado a media cuadra de la UMAX.",
    "images": ["https://skyone.example/fotos/1234-1.jpg", "https://skyone.example/fotos/1234-2.jpg"],
    "categories": ["INVERTIR"]
  }'
```

Flujo sugerido para el publicador:

1. Pedir `/property-types` una vez y mapear los tipos de SkyOne a esos códigos.
2. Por cada propiedad, hacer un `PUT` con su id de SkyOne. Repetirlo cuando cambie algo.
3. Si en SkyOne se vendió o se dio de baja, hacer un `PUT` con `"status": "VENDIDA"` o un `DELETE`.
4. Revisar los borradores nuevos en la oficina virtual (`reviewUrl`) y publicarlos.

## Fuera de esta versión

Detalles residenciales (dormitorios, baños), equipamiento y datos de proyectos de inversión (constructora, tipologías) se cargan por ahora desde la oficina virtual.
