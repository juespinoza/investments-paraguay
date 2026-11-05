// Marco común de las pantallas de acceso (login, olvidé y restablecer).
export function AuthCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-sm border">
        <h1 className="text-2xl font-semibold text-primary">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm text-secondary">{subtitle}</p> : null}
        {children}
      </div>
    </div>
  );
}

export const authInputClass = "w-full rounded-md border px-3 py-2";
