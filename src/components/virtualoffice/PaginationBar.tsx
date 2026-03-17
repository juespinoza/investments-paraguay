import Link from "next/link";

function buildHref(
  pathname: string,
  searchParams: Record<string, string | undefined>,
  nextPage: number,
  perPage: number,
) {
  const params = new URLSearchParams();

  Object.entries(searchParams).forEach(([key, value]) => {
    if (value && key !== "page" && key !== "perPage") {
      params.set(key, value);
    }
  });

  params.set("page", String(nextPage));
  params.set("perPage", String(perPage));

  return `${pathname}?${params.toString()}`;
}

export default function PaginationBar({
  pathname,
  searchParams,
  page,
  perPage,
  totalItems,
  totalPages,
}: {
  pathname: string;
  searchParams: Record<string, string | undefined>;
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
}) {
  if (totalItems === 0) return null;

  const from = (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, totalItems);

  return (
    <div className="flex flex-col gap-3 rounded-[1.5rem] border border-[rgba(24,39,63,0.08)] bg-white/90 p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
      <div className="text-sm text-zinc-600">
        Mostrando <span className="font-medium text-zinc-900">{from}</span> a{" "}
        <span className="font-medium text-zinc-900">{to}</span> de{" "}
        <span className="font-medium text-zinc-900">{totalItems}</span>{" "}
        registros.
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Link
          href={buildHref(pathname, searchParams, Math.max(1, page - 1), perPage)}
          aria-disabled={page <= 1}
          className="inline-flex h-10 items-center justify-center rounded-xl border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-800 hover:bg-zinc-50 aria-disabled:pointer-events-none aria-disabled:opacity-50"
        >
          Anterior
        </Link>

        <div className="rounded-xl bg-[#fcfaf6] px-3 py-2 text-sm font-medium text-zinc-700">
          Página {page} de {totalPages}
        </div>

        <Link
          href={buildHref(
            pathname,
            searchParams,
            Math.min(totalPages, page + 1),
            perPage,
          )}
          aria-disabled={page >= totalPages}
          className="inline-flex h-10 items-center justify-center rounded-xl border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-800 hover:bg-zinc-50 aria-disabled:pointer-events-none aria-disabled:opacity-50"
        >
          Siguiente
        </Link>
      </div>
    </div>
  );
}
