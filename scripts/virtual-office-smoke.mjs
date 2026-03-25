#!/usr/bin/env node

const BASE_URL = process.env.QA_BASE_URL ?? "http://localhost:3000";

const ROLE_CONFIG = [
  {
    role: "ADMIN",
    email: process.env.QA_ADMIN_EMAIL,
    password: process.env.QA_ADMIN_PASSWORD,
    allowed: [
      "/virtual-office",
      "/virtual-office/workflow",
      "/virtual-office/usuarios",
      "/virtual-office/inmobiliaria",
      "/virtual-office/asesores",
      "/virtual-office/propiedades",
      "/virtual-office/blog",
    ],
    denied: [],
    apiAllowed: [
      "/api/auth/me",
      "/api/virtualoffice/inmobiliarias",
      "/api/virtualoffice/properties?take=1",
    ],
    apiDenied: [],
  },
  {
    role: "INMOBILIARIA",
    email: process.env.QA_INMOBILIARIA_EMAIL,
    password: process.env.QA_INMOBILIARIA_PASSWORD,
    allowed: [
      "/virtual-office",
      "/virtual-office/usuarios",
      "/virtual-office/inmobiliaria",
      "/virtual-office/asesores",
      "/virtual-office/propiedades",
      "/virtual-office/leads",
      "/virtual-office/blog",
    ],
    denied: [
      "/virtual-office/workflow",
      "/virtual-office/inmobiliaria/new",
      "/virtual-office/propiedades/new",
    ],
    apiAllowed: [
      "/api/auth/me",
      "/api/virtualoffice/inmobiliarias",
      "/api/virtualoffice/properties?take=1",
    ],
    apiDenied: [],
  },
  {
    role: "ASESOR",
    email: process.env.QA_ASESOR_EMAIL,
    password: process.env.QA_ASESOR_PASSWORD,
    allowed: [
      "/virtual-office",
      "/virtual-office/mi-landing",
      "/virtual-office/asesores",
      "/virtual-office/propiedades",
      "/virtual-office/leads",
      "/virtual-office/blog",
    ],
    denied: [
      "/virtual-office/workflow",
      "/virtual-office/usuarios",
      "/virtual-office/inmobiliaria",
      "/virtual-office/asesores/new",
    ],
    apiAllowed: [
      "/api/auth/me",
      "/api/virtualoffice/properties?take=1",
    ],
    apiDenied: [
      "/api/virtualoffice/inmobiliarias",
    ],
  },
  {
    role: "BLOGUERO",
    email: process.env.QA_BLOGUERO_EMAIL,
    password: process.env.QA_BLOGUERO_PASSWORD,
    allowed: [
      "/virtual-office",
      "/virtual-office/blog",
    ],
    denied: [
      "/virtual-office/workflow",
      "/virtual-office/usuarios",
      "/virtual-office/propiedades",
      "/virtual-office/inmobiliaria",
      "/virtual-office/asesores",
    ],
    apiAllowed: [
      "/api/auth/me",
    ],
    apiDenied: [
      "/api/virtualoffice/inmobiliarias",
      "/api/virtualoffice/properties?take=1",
    ],
  },
];

const FORBIDDEN_MARKERS = [
  "No tienes permisos",
  "Forbidden",
  "Unauthorized",
  "Ir a login",
  "Solo un admin puede",
  "Solo un administrador puede",
];

function log(line) {
  process.stdout.write(`${line}\n`);
}

function pickCookie(setCookieHeader) {
  if (!setCookieHeader) return null;
  return setCookieHeader.split(",")[0].split(";")[0];
}

async function request(path, cookie) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: cookie ? { cookie } : undefined,
    redirect: "manual",
  });
  const text = await response.text();
  return { response, text };
}

async function requestJson(path, cookie) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: cookie ? { cookie, accept: "application/json" } : { accept: "application/json" },
    redirect: "manual",
  });
  const text = await response.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = null;
  }
  return { response, text, json };
}

function bodyLooksDenied(text) {
  return FORBIDDEN_MARKERS.some((marker) => text.includes(marker));
}

async function login(email, password) {
  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    redirect: "manual",
  });

  const text = await response.text();
  const cookie = pickCookie(response.headers.get("set-cookie"));

  if (!response.ok || !cookie) {
    throw new Error(`Login failed with status ${response.status}: ${text}`);
  }

  return cookie;
}

async function assertInvalidLogin() {
  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "invalid-qa-user@example.com",
      password: "wrong-password-123",
    }),
    redirect: "manual",
  });

  if (response.status !== 401) {
    throw new Error(`Expected invalid login to return 401, got ${response.status}.`);
  }
}

async function assertUnauthenticatedMe() {
  const { response, json } = await requestJson("/api/auth/me");
  if (response.status !== 200) {
    throw new Error(`Expected /api/auth/me without session to return 200, got ${response.status}.`);
  }
  if (json?.authenticated !== false) {
    throw new Error("Expected unauthenticated /api/auth/me to return authenticated=false.");
  }
}

async function assertGuestBlocked(path) {
  const { response, text } = await request(path);
  const looksRedirect = response.status === 307 || response.status === 308;
  const looksDenied = response.status === 401 || response.status === 403 || bodyLooksDenied(text);

  if (!looksRedirect && !looksDenied) {
    throw new Error(`Guest access to ${path} was not blocked. Status: ${response.status}.`);
  }
}

async function assertAuthenticated(cookie, expectedRole) {
  const response = await fetch(`${BASE_URL}/api/auth/me`, {
    headers: { cookie },
    redirect: "manual",
  });
  const data = await response.json();

  if (!data?.authenticated) {
    throw new Error(`Expected authenticated session for ${expectedRole}.`);
  }

  if (data.user?.role !== expectedRole) {
    throw new Error(
      `Expected role ${expectedRole}, received ${data.user?.role ?? "unknown"}.`,
    );
  }
}

async function assertLogout(cookie) {
  const response = await fetch(`${BASE_URL}/api/auth/logout`, {
    method: "POST",
    headers: { cookie },
    redirect: "manual",
  });

  if (!response.ok) {
    throw new Error(`Logout failed with status ${response.status}.`);
  }

  const setCookie = response.headers.get("set-cookie") ?? "";
  const expiresCookie =
    setCookie.includes("Expires=Thu, 01 Jan 1970 00:00:00 GMT") ||
    setCookie.includes("Max-Age=0");

  if (!expiresCookie) {
    throw new Error("Logout did not return an expiring session cookie.");
  }

  const next = await fetch(`${BASE_URL}/api/auth/me`, {
    redirect: "manual",
  });
  const data = await next.json();
  if (data?.authenticated) {
    throw new Error("Session remained authenticated without cookie after logout.");
  }
}

async function assertAllowed(path, cookie) {
  const { response, text } = await request(path, cookie);
  if (response.status !== 200) {
    throw new Error(`Expected 200 for ${path}, got ${response.status}.`);
  }
  if (bodyLooksDenied(text)) {
    throw new Error(`Allowed route ${path} rendered a denial marker.`);
  }
}

async function assertDenied(path, cookie) {
  const { response, text } = await request(path, cookie);

  if (response.status >= 500) {
    throw new Error(`Denied route ${path} returned ${response.status}.`);
  }

  if (response.status === 200 && !bodyLooksDenied(text)) {
    throw new Error(`Denied route ${path} returned 200 without denial markers.`);
  }
}

async function assertAllowedApi(path, cookie) {
  const { response, json } = await requestJson(path, cookie);
  if (response.status !== 200) {
    throw new Error(`Expected API 200 for ${path}, got ${response.status}.`);
  }
  if (json?.error) {
    throw new Error(`Allowed API ${path} returned error: ${json.error}`);
  }
}

async function assertDeniedApi(path, cookie) {
  const { response } = await requestJson(path, cookie);
  if (![401, 403].includes(response.status)) {
    throw new Error(`Expected API denial for ${path}, got ${response.status}.`);
  }
}

async function runRole(config) {
  log(`\n[${config.role}] Login and route smoke`);
  const cookie = await login(config.email, config.password);
  await assertAuthenticated(cookie, config.role);

  for (const path of config.allowed) {
    await assertAllowed(path, cookie);
    log(`  OK allowed ${path}`);
  }

  for (const path of config.denied) {
    await assertDenied(path, cookie);
    log(`  OK denied ${path}`);
  }

  for (const path of config.apiAllowed ?? []) {
    await assertAllowedApi(path, cookie);
    log(`  OK api allowed ${path}`);
  }

  for (const path of config.apiDenied ?? []) {
    await assertDeniedApi(path, cookie);
    log(`  OK api denied ${path}`);
  }

  await assertLogout(cookie);
  log("  OK logout");
}

async function main() {
  const configured = ROLE_CONFIG.filter((item) => item.email && item.password);

  if (configured.length === 0) {
    log("No QA credentials configured. Set QA_* env vars to run integration smoke tests.");
    process.exit(0);
  }

  log("[guest] Pre-login smoke");
  await assertInvalidLogin();
  log("  OK invalid login");
  await assertUnauthenticatedMe();
  log("  OK /api/auth/me unauthenticated");
  await assertGuestBlocked("/virtual-office");
  log("  OK guest blocked /virtual-office");
  await assertGuestBlocked("/virtual-office/workflow");
  log("  OK guest blocked /virtual-office/workflow");

  for (const config of configured) {
    await runRole(config);
  }

  log("\nIntegration smoke tests completed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
