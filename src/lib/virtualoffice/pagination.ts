export type PaginationInput = {
  page?: string;
  perPage?: string;
  defaultPerPage?: number;
  allowedPerPage?: number[];
};

export type PaginationResult = {
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  offset: number;
};

function toPositiveInt(value: string | undefined) {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

export function resolvePagination(
  input: PaginationInput,
  totalItems: number,
): PaginationResult {
  const allowedPerPage = input.allowedPerPage ?? [10, 25, 50];
  const defaultPerPage = input.defaultPerPage ?? allowedPerPage[0] ?? 10;
  const requestedPerPage = toPositiveInt(input.perPage);
  const perPage = requestedPerPage && allowedPerPage.includes(requestedPerPage)
    ? requestedPerPage
    : defaultPerPage;

  const totalPages = Math.max(1, Math.ceil(totalItems / perPage));
  const requestedPage = toPositiveInt(input.page) ?? 1;
  const page = Math.min(requestedPage, totalPages);
  const offset = (page - 1) * perPage;

  return {
    page,
    perPage,
    totalItems,
    totalPages,
    offset,
  };
}

export function paginateItems<T>(
  items: T[],
  pagination: Pick<PaginationResult, "offset" | "perPage">,
) {
  return items.slice(pagination.offset, pagination.offset + pagination.perPage);
}
