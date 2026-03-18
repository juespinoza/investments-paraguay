"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

type LogoutButtonProps = {
  className?: string;
  label?: string;
  onLoggedOut?: () => void;
};

export function LogoutButton({
  className,
  label = "Cerrar sesión",
  onLoggedOut,
}: LogoutButtonProps) {
  const router = useRouter();

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      onLoggedOut?.();
      router.replace("/virtual-office/login");
      router.refresh();
    }
  }

  return (
    <button type="button" onClick={handleLogout} className={className}>
      <LogOut size={16} />
      {label}
    </button>
  );
}
