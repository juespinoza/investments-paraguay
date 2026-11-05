import test from "node:test";
import assert from "node:assert/strict";
import {
  RESET_TOKEN_TTL_MINUTES,
  generateResetToken,
  hashResetToken,
  isWellFormedToken,
  passwordProblem,
  resetBaseUrl,
  resetTokenExpiry,
  sessionIssuedBeforePasswordChange,
  tokenState,
} from "../src/lib/auth/password-reset-core.ts";

test("token aleatorio, con formato fijo y distinto en cada pedido", () => {
  const a = generateResetToken();
  const b = generateResetToken();
  assert.notEqual(a, b);
  assert.equal(isWellFormedToken(a), true);
  assert.equal(isWellFormedToken("corto"), false);
  assert.equal(isWellFormedToken(undefined), false);
  assert.equal(isWellFormedToken(`${a}'; DROP`), false);
});

test("en la base se guarda solo el hash del token", () => {
  const token = generateResetToken();
  const hash = hashResetToken(token);
  assert.match(hash, /^[0-9a-f]{64}$/);
  assert.notEqual(hash, token);
  assert.equal(hashResetToken(token), hash);
});

test("el link vence a los 30 minutos y sirve una sola vez", () => {
  const now = new Date("2026-11-05T12:00:00Z");
  const expiresAt = resetTokenExpiry(now);
  assert.equal(expiresAt.getTime() - now.getTime(), RESET_TOKEN_TTL_MINUTES * 60_000);
  assert.equal(tokenState({ expiresAt, usedAt: null }, now), "valid");
  assert.equal(tokenState({ expiresAt, usedAt: null }, expiresAt), "expired");
  assert.equal(tokenState({ expiresAt, usedAt: now }, now), "used");
  assert.equal(tokenState(null, now), "invalid");
});

test("reglas de la contraseña nueva", () => {
  assert.match(passwordProblem("1234567") ?? "", /8 caracteres/);
  assert.equal(passwordProblem("12345678"), null);
  assert.match(passwordProblem("x".repeat(73)) ?? "", /72/);
});

test("las sesiones anteriores al cambio de contraseña dejan de valer", () => {
  const changed = new Date("2026-11-05T12:00:00.500Z");
  const changedSec = Math.floor(changed.getTime() / 1000);
  assert.equal(sessionIssuedBeforePasswordChange(changedSec - 60, changed), true);
  assert.equal(sessionIssuedBeforePasswordChange(changedSec, changed), false);
  assert.equal(sessionIssuedBeforePasswordChange(changedSec + 5, changed), false);
  assert.equal(sessionIssuedBeforePasswordChange(undefined, changed), true);
  assert.equal(sessionIssuedBeforePasswordChange(123, null), false);
});

test("la URL del link no depende del Host del pedido", () => {
  const site = "https://www.investmentsparaguay.com";
  assert.equal(resetBaseUrl({}, site), site);
  assert.equal(resetBaseUrl({ APP_BASE_URL: "https://x.com/" }, site), "https://x.com");
  assert.equal(
    resetBaseUrl({ VERCEL_ENV: "preview", VERCEL_URL: "ip-abc.vercel.app" }, site),
    "https://ip-abc.vercel.app",
  );
  assert.equal(resetBaseUrl({ VERCEL_ENV: "production", VERCEL_URL: "ip.vercel.app" }, site), site);
  assert.equal(resetBaseUrl({ NODE_ENV: "development" }, site), "http://localhost:3000");
});
