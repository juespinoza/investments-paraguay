export default function AdminFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 text-xs text-zinc-500 sm:px-6 lg:px-8">
        <span>© {new Date().getFullYear()} Investments Paraguay</span>
        <span className="hidden sm:inline">Admin UI • performance-first</span>
      </div>
    </footer>
  );
}
