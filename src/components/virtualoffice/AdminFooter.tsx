export default function AdminFooter() {
  return (
    <footer className="mt-8 border-t border-[rgba(24,39,63,0.08)] pt-5">
      <div className="flex flex-col gap-2 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
        <span>© {new Date().getFullYear()} Investments Paraguay</span>
        <span>Oficina virtual · Productividad premium · Permisos por rol activos</span>
      </div>
    </footer>
  );
}
