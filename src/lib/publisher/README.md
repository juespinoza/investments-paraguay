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
| `CLOUDINARY_CLOUD_NAME` | Sí, para fotos | Cuenta de Cloudinary donde sube el publicador. |
| `NEXT_PUBLIC_CLOUDINARY_PUBLISHER_CLOUD_NAME` | Sí, para fotos | La misma cuenta del publicador, para mostrar en el navegador las primeras importaciones guardadas como `publisher/skyone/…`. |
| `CLOUDINARY_API_KEY` | Sí, para fotos | Credencial de la Upload API **de esa misma cuenta** (Cloudinary → Settings → API Keys). |
| `CLOUDINARY_API_SECRET` | Sí, para fotos | Secreto de esa credencial. Nunca en el navegador ni en el repo. |
| `CONTENT_API_KEY` | No | Clave aparte, **solo** para estrategias y traducciones (no puede crear, editar ni retirar propiedades). Para quien prepara contenido; revocarla no afecta al publicador. Generala con `openssl rand -hex 32`. |
| `PUBLISHER_DEFAULT_ADVISOR_SLUG` | No | Asesor asignado por defecto a las propiedades nuevas, por ejemplo `julia-espinoza`. |

`NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` sigue siendo la cuenta histórica del sitio. Con ella se muestran las fotos viejas guardadas como public_id, así que **no hay que cambiarla**. El publicador no la usa para subir.

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
| `GET` / `PUT` | `/properties/{source}/{externalId}/strategy` | Lee o guarda la estrategia de inversión (ver abajo). |
| `GET` / `PUT` | `/strategies/{slug}` | Lo mismo por slug, para propiedades cargadas a mano en la oficina virtual. |
| `GET` | `/translations` | Lista las propiedades publicadas sin traducción o con traducción vieja (cambió el español). |
| `GET` / `PUT` | `/translations/{slug}` | Lee el texto en español a traducir y guarda a mano la traducción de un idioma (`locale`: `en` o `pt`), como `REVIEWED`. |
| `POST` | `/translations?limit=8` | **Apagado hasta tener `ANTHROPIC_API_KEY` con saldo.** Traduce automáticamente lo pendiente. Ver la nota al inicio de `src/lib/properties/translate.ts`. |

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
| `areaM2` | number \| null | Superficie general. Se usa si no hay `builtM2` ni `landM2`. |
| `builtM2`, `landM2` | number \| null | v2. Construcción y terreno. El precio por m² usa terreno en lotes y chacras, y construcción en el resto. |
| `frontM`, `depthM` | number \| null | v2. Frente y fondo en metros. |
| `bedrooms`, `bathrooms`, `parking` | entero \| null | v2. Se muestran en la ficha. |
| `amenities` | string[] (máx. 80) | v2. Comodidades tal como vienen del portal. |
| `sourceUrl` | URL \| null | v2. Ficha en el portal de origen. No se publica. |
| `agentName`, `office` | string \| null | v2. Asesor y oficina del portal de origen. No se publican. |
| `roiAnnualPct`, `appreciationAnnualPct` | number 0–100 \| null | Obsoletos: el sitio ya no los muestra. El ROI público sale de la estrategia. |
| `hasPropertyDocuments` | boolean | |
| `images` | URL[] (máx. 30) | La primera es la portada. Enviar `[]` borra las fotos. Omitir el campo las mantiene. |
| `categories` | `("CONOCER"\|"VIVIR"\|"INVERTIR")[]` | |
| `advisorSlug` | string \| null | Slug del asesor. `null` lo desasigna. |
| `status` | `RESERVADA` \| `VENDIDA` \| `ALQUILADA` \| `RETIRADA` | Solo en actualizaciones. Al crear se ignora. |

Campos no listados se rechazan con 422, para detectar a tiempo un error de mapeo en el publicador.

Cuando haya `ANTHROPIC_API_KEY` con saldo, cada alta o edición dispara, después de responder, la traducción automática del título, la descripción y los textos de la estrategia a inglés y portugués (requiere `ANTHROPIC_API_KEY`). Si el texto en español no cambió, no se vuelve a traducir. La respuesta incluye `strategyStatus` y `translatedLocales`.

## Estrategia de inversión

Toda propiedad nueva nace con la estrategia en `PENDING`: la ficha muestra "Estrategia en preparación", sin cifras de rentabilidad, y un formulario para que el interesado pida el análisis. Con `status: "READY"` la ficha muestra el análisis completo y el ROI pasa a verse en el listado.

Cuerpo del `PUT .../strategy` (todos opcionales; omitido = no se toca, `null` = se borra; montos en la moneda de la propiedad):

| Campo | Tipo | Notas |
| --- | --- | --- |
| `status` | `PENDING` \| `READY` | `READY` exige `summary`, `rentStrategy` y, salvo reventa, `rentKind` y `monthlyRent`. Si falta algo responde 422 con `details.missing`. |
| `summary` | string ≤ 600 | Tesis de inversión en una o dos frases. |
| `rentStrategy` | `LONG_TERM` \| `SHORT_TERM` \| `COMMERCIAL` \| `RESALE` | |
| `rentKind` | `ACTUAL` \| `ESTIMATED` | Renta activa (contrato vigente) o estimada. |
| `monthlyRent` | number | |
| `occupancyPct` | 0–100 | Sin dato se toma 100 %. Para temporario, la ocupación esperada. |
| `managementFeePct` | 0–100 | Sobre la renta cobrada. |
| `monthlyExpenses` | number | Gastos mensuales a cargo del dueño. |
| `annualTaxes` | number | |
| `acquisitionCostsPct` | 0–100 | Escribanía, impuestos y comisión, sobre el precio. |
| `appreciationPct` | 0–100 | Plusvalía anual esperada. |
| `zonePricePerM2` | number | Promedio de la zona, para comparar. |
| `zonePriceSource` | string ≤ 300 | De dónde sale ese promedio. |
| `comparables` | `{ title, price, areaM2?, url? }[]` (máx. 12) | |
| `businessOptions` | `{ title, description }[]` (máx. 8) | Negocios posibles con la propiedad. |
| `zoneSummary`, `risks`, `methodology` | string ≤ 3000 | Admiten `**negrita**` y párrafos. |
| `featureOnReady` | boolean | No se guarda. `false` evita que la propiedad pase a destacada al marcarla `READY`. |

Cuando una estrategia pasa a `READY`, la propiedad se marca como destacada (una sola vez: si se le quita el destacado a mano, no se vuelve a marcar).

La ficha calcula: rendimiento bruto = renta × 12 × ocupación ÷ precio; neto = (renta cobrada − administración − gastos − impuestos) ÷ (precio + costos de compra); recupero = inversión total ÷ ingreso neto anual. El cálculo está en `src/lib/properties/investment.ts`.

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


### Imágenes de varias cuentas Cloudinary

Las nuevas subidas guardan `secure_url` completo en portada y galería. Así la
cuenta de subida puede diferir de la cuenta pública histórica sin romper fotos.
Las URLs completas conservan su cuenta. Los IDs antiguos normales siguen usando
`NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` (la cuenta histórica). Como compatibilidad
con las primeras importaciones, los IDs `publisher/skyone/…` sin URL se resuelven
contra `NEXT_PUBLIC_CLOUDINARY_PUBLISHER_CLOUD_NAME`. No cambiar esa cuenta sin
migrar esos registros. Los nombres de cuenta van solo en variables de entorno.
No requiere migración de base ni reenvío: el despliegue corrige su visualización.
Reenviar una propiedad mediante la API guardará las URLs completas de sus fotos.

Verificación posterior al despliegue: abrir una foto antigua y una importada,
verificar HTTP 200 y visualización en tarjeta, galería y mapa. La visibilidad
pública sigue dependiendo del estado: BORRADOR no aparece en los listados.
