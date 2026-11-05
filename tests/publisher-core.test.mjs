import test from "node:test";
import assert from "node:assert/strict";
import {
  buildPropertySlug,
  cloudinarySignature,
  imagePublicId,
  isValidExternalId,
  isValidSource,
  ownCloudinaryPublicId,
  readBearerToken,
  resolveStatus,
  slugify,
  tokensMatch,
} from "../src/lib/publisher/core.ts";

test("firma de Cloudinary coincide con el ejemplo de la documentación oficial", () => {
  // https://cloudinary.com/documentation/authentication_signatures
  const signature = cloudinarySignature(
    {
      eager: "w_400,h_300,c_pad|w_260,h_200,c_crop",
      public_id: "sample_image",
      timestamp: 1315060510,
      file: "ignorado",
      api_key: "ignorado",
    },
    "abcd",
  );
  assert.equal(signature, "bfd09f95f331f558cbd1320e67aa8d488770583e");
});

test("un alta siempre entra como borrador", () => {
  assert.equal(resolveStatus(true, null, undefined), "BORRADOR");
  assert.equal(resolveStatus(true, null, "VENDIDA"), "BORRADOR");
});

test("una actualización nunca publica y solo acepta estados fuera de mercado", () => {
  assert.equal(resolveStatus(false, "EN_VENTA", undefined), "EN_VENTA");
  assert.equal(resolveStatus(false, "EN_VENTA", "VENDIDA"), "VENDIDA");
  assert.equal(resolveStatus(false, "BORRADOR", "EN_VENTA"), "BORRADOR");
  assert.equal(resolveStatus(false, "BORRADOR", "EN_ALQUILER"), "BORRADOR");
  assert.equal(resolveStatus(false, "EN_VENTA", "RETIRADA"), "RETIRADA");
});

test("slug estable a partir del título y el id externo", () => {
  assert.equal(slugify("Monoambiente con Cama King — Asunción"), "monoambiente-con-cama-king-asuncion");
  assert.equal(buildPropertySlug("Campus Lofts", "SKY-1234"), "campus-lofts-sky-1234");
  assert.equal(buildPropertySlug("¡¡!!", "42"), "propiedad-42");
});

test("public_id de imagen determinístico por propiedad y URL", () => {
  const a = imagePublicId("skyone", "SKY-1", "https://example.com/a.jpg");
  const b = imagePublicId("skyone", "SKY-1", "https://example.com/a.jpg");
  const c = imagePublicId("skyone", "SKY-1", "https://example.com/b.jpg");
  assert.equal(a, b);
  assert.notEqual(a, c);
  assert.match(a, /^publisher\/skyone\/sky-1\/[0-9a-f]{16}$/);
});

test("reconoce URLs de nuestro Cloudinary y extrae el public_id", () => {
  assert.equal(
    ownCloudinaryPublicId("https://res.cloudinary.com/legacy-cloud/image/upload/v1712/folder/foto.jpg", "legacy-cloud"),
    "folder/foto",
  );
  assert.equal(
    ownCloudinaryPublicId("https://res.cloudinary.com/legacy-cloud/image/upload/c_fill,w_400/v1/prop2_fwvlnh", "legacy-cloud"),
    "prop2_fwvlnh",
  );
  assert.equal(ownCloudinaryPublicId("https://res.cloudinary.com/otra/image/upload/v1/x.jpg", "legacy-cloud"), null);
  assert.equal(ownCloudinaryPublicId("https://skyone.com.py/fotos/1.jpg", "legacy-cloud"), null);
});

test("autenticación por Bearer token", () => {
  assert.equal(readBearerToken("Bearer abc123"), "abc123");
  assert.equal(readBearerToken("bearer  abc123 "), "abc123");
  assert.equal(readBearerToken("Basic abc123"), null);
  assert.equal(tokensMatch("abc123", "abc123"), true);
  assert.equal(tokensMatch("abc124", "abc123"), false);
  assert.equal(tokensMatch(null, "abc123"), false);
  assert.equal(tokensMatch("abc123", ""), false);
});

test("valida origen e id externo", () => {
  assert.equal(isValidSource("skyone"), true);
  assert.equal(isValidSource("SkyOne"), false);
  assert.equal(isValidSource("a"), false);
  assert.equal(isValidExternalId("SKY-1234_a.b"), true);
  assert.equal(isValidExternalId("../etc"), false);
  assert.equal(isValidExternalId(""), false);
});
