import { useState } from "react";

export function StringArrayEditor({
  title,
  items,
  onAdd,
  onRemove,
}: {
  title: string;
  items: string[];
  onAdd: (value: string) => void;
  onRemove: (value: string) => void;
}) {
  const [value, setValue] = useState("");

  return (
    <div className="rounded-md border p-3">
      <div className="font-medium">{title}</div>

      <div className="mt-2 flex gap-2">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full rounded-md border px-3 py-2"
          placeholder="Agregar..."
        />
        <button
          type="button"
          onClick={() => {
            onAdd(value);
            setValue("");
          }}
          className="rounded-md bg-accent1 px-3 py-2 text-sm font-medium text-primary hover:opacity-90"
        >
          Agregar
        </button>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {items?.map((it) => (
          <button
            key={it}
            type="button"
            onClick={() => onRemove(it)}
            className="rounded-full bg-accent2 px-3 py-1 text-sm text-secondary hover:opacity-80"
            title="Quitar"
          >
            {it} ✕
          </button>
        ))}
      </div>
    </div>
  );
}
