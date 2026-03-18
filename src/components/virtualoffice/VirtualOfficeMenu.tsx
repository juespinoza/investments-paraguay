"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { VIRTUALOFFICE_MENU, Role } from "@/lib/virtualoffice/menu";
import { LogoutButton } from "./LogoutButton";

type MeResponse =
  | { authenticated: false }
  | { authenticated: true; user: { id: string; email: string; role: Role } };

export function VirtualOfficeMenu() {
  const [me, setMe] = useState<MeResponse | null>(null);

  useEffect(() => {
    let mounted = true;
    fetch("/api/auth/me", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => mounted && setMe(data))
      .catch(() => mounted && setMe({ authenticated: false }));
    return () => {
      mounted = false;
    };
  }, []);

  const items = useMemo(() => {
    if (!me || !me.authenticated) return [];
    return VIRTUALOFFICE_MENU.filter((i) => i.roles.includes(me.user.role));
  }, [me]);

  if (!me) return null; // o skeleton

  return (
    <nav className="flex flex-col gap-2">
      {items.map((i) => (
        <Link
          key={i.href}
          href={i.href}
          className="rounded-md px-3 py-2 text-secondary hover:bg-accent2 hover:text-primary"
        >
          {i.label}
        </Link>
      ))}

      <LogoutButton className="mt-2 inline-flex items-center gap-2 rounded-md px-3 py-2 text-left text-secondary hover:bg-accent2 hover:text-primary" />
    </nav>
  );
}
