// src/components/virtualoffice/advisors/FeaturedPicker.tsx
"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  FixedSizeList,
  type ListChildComponentProps,
  type ListOnItemsRenderedProps,
} from "react-window";
import { ApiResponse, PropertyOption, Props } from "./type";

function useDebouncedValue<T>(value: T, delayMs: number) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(t);
  }, [value, delayMs]);

  return debounced;
}

export const FeaturedPicker = React.memo(function FeaturedPicker({
  advisorId,
  selectedIds,
  onChange,
  max = 3,
}: Props) {
  const [q, setQ] = useState("");
  const debouncedQ = useDebouncedValue(q, 250);

  const [items, setItems] = useState<PropertyOption[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // evita “race conditions” si el usuario escribe rápido
  const requestIdRef = useRef(0);

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const canUsePicker = Boolean(advisorId);

  const toggle = useCallback(
    (id: string) => {
      const exists = selectedSet.has(id);
      if (exists) {
        onChange(selectedIds.filter((x) => x !== id));
        return;
      }
      if (selectedIds.length >= max) return;
      onChange([...selectedIds, id]);
    },
    [max, onChange, selectedIds, selectedSet]
  );

  const fetchPage = useCallback(
    async (opts: { cursor?: string | null; reset?: boolean }) => {
      if (!advisorId) return;

      const reset = Boolean(opts.reset);
      const cursor = opts.cursor ?? null;

      const myRequestId = ++requestIdRef.current;
      try {
        reset ? setLoading(true) : setLoadingMore(true);
        setError(null);

        const sp = new URLSearchParams();
        sp.set("advisorId", advisorId);
        sp.set("take", "50");
        if (debouncedQ.trim()) sp.set("q", debouncedQ.trim());
        if (cursor) sp.set("cursor", cursor);

        const res = await fetch(
          `/api/virtualoffice/properties?${sp.toString()}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            cache: "no-store",
          }
        );

        const json = (await res.json()) as ApiResponse & { error?: string };

        // si llegó una respuesta vieja, la ignoramos
        if (myRequestId !== requestIdRef.current) return;

        if (!res.ok)
          throw new Error(json?.error || "Failed to load properties");

        setNextCursor(json.nextCursor ?? null);
        setItems((prev) => (reset ? json.items : [...prev, ...json.items]));
      } catch (e: any) {
        if (myRequestId !== requestIdRef.current) return;
        setError(e?.message ?? "Error");
      } finally {
        if (myRequestId !== requestIdRef.current) return;
        reset ? setLoading(false) : setLoadingMore(false);
      }
    },
    [advisorId, debouncedQ]
  );

  // carga inicial + cambios de búsqueda
  useEffect(() => {
    if (!advisorId) return;
    setItems([]);
    setNextCursor(null);
    fetchPage({ reset: true, cursor: null });
  }, [advisorId, debouncedQ, fetchPage]);

  const loadMore = useCallback(() => {
    if (!nextCursor) return;
    if (loading || loadingMore) return;
    fetchPage({ cursor: nextCursor, reset: false });
  }, [fetchPage, loading, loadingMore, nextCursor]);

  // Virtual list row
  const Row = useCallback(({ index, style, data }: ListChildComponentProps) => {
    const p = (data.items as PropertyOption[])[index];
    const isSelected = data.selectedSet.has(p.id);

    return (
      <div style={style} className="px-1">
        <button
          type="button"
          onClick={() => data.toggle(p.id)}
          className={`w-full rounded-md border p-3 text-left hover:bg-accent2 ${
            isSelected ? "border-accent1" : "border-accent2"
          }`}
        >
          <div className="font-medium">{p.title}</div>
          <div className="text-sm text-secondary">
            {p.city ?? "-"} {p.priceUsd ? `• USD ${p.priceUsd}` : ""}
          </div>
          {isSelected ? (
            <div className="mt-1 text-xs text-secondary">Seleccionada</div>
          ) : null}
        </button>
      </div>
    );
  }, []);

  // data estable para react-window
  const listData = useMemo(
    () => ({
      items,
      selectedSet,
      toggle,
    }),
    [items, selectedSet, toggle]
  );

  if (!canUsePicker) {
    return (
      <div className="rounded-md border border-accent2 bg-accent2/30 p-3 text-sm text-secondary">
        Primero guardá el asesor para poder seleccionar propiedades destacadas.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="text-sm text-secondary">
          Seleccionadas: {selectedIds.length}/{max}
        </div>

        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="w-full rounded-md border px-3 py-2 md:max-w-sm"
          placeholder="Buscar por título, slug o ciudad..."
        />
      </div>

      {error ? (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="text-sm text-secondary">Cargando propiedades...</div>
      ) : null}

      {!loading && !items.length ? (
        <div className="text-sm text-secondary">
          No hay resultados para este asesor.
        </div>
      ) : null}

      {!!items.length ? (
        <div className="rounded-md border border-accent2 p-2">
          <FixedSizeList
            height={420}
            itemCount={items.length}
            itemSize={92}
            width={"100%"}
            itemData={listData}
            onItemsRendered={({
              visibleStopIndex,
            }: ListOnItemsRenderedProps) => {
              if (visibleStopIndex >= items.length - 10) {
                loadMore();
              }
            }}
          >
            {Row}
          </FixedSizeList>

          <div className="mt-2 flex items-center justify-between">
            <div className="text-xs text-secondary">
              {loadingMore
                ? "Cargando más..."
                : nextCursor
                ? "Scroll para cargar más"
                : "Fin"}
            </div>

            {nextCursor ? (
              <button
                type="button"
                onClick={loadMore}
                disabled={loadingMore}
                className="rounded-md border px-3 py-2 text-sm hover:bg-accent2 disabled:opacity-60"
              >
                {loadingMore ? "Cargando..." : "Cargar más"}
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
});
