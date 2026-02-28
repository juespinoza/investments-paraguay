"use server";

import { cookies } from "next/headers";

export async function setLocale(nextLocale: "en" | "es" | "pt" | "de") {
  (await cookies()).set("locale", nextLocale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
}
