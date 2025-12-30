export type Role = "ADMIN" | "INMOBILIARIA" | "ASESOR" | "BLOGUERO";

export type MenuItem = {
  label: string;
  href: string;
  roles: Role[];
};

export const VIRTUALOFFICE_MENU: MenuItem[] = [
  {
    label: "Dashboard",
    href: "/virtual-office",
    roles: ["ADMIN", "INMOBILIARIA", "ASESOR", "BLOGUERO"],
  },

  { label: "Usuarios", href: "/virtual-office/usuarios", roles: ["ADMIN"] },

  {
    label: "Inmobiliarias",
    href: "/virtual-office/inmobiliarias",
    roles: ["ADMIN", "INMOBILIARIA"],
  },

  {
    label: "Asesores",
    href: "/virtual-office/asesores",
    roles: ["ADMIN", "ASESOR"],
  },

  {
    label: "Propiedades",
    href: "/virtual-office/propiedades",
    roles: ["ADMIN", "INMOBILIARIA", "ASESOR"],
  },

  {
    label: "Blog",
    href: "/virtual-office/blog",
    roles: ["ADMIN", "BLOGUERO"],
  },
];
