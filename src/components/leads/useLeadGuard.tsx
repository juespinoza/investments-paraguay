"use client";

import { useEffect, useRef } from "react";
import { HONEYPOT_FIELD, type LeadGuard } from "@/lib/leads/spam";

// Agrega a un formulario de leads el campo trampa y el tiempo de llenado.
// Uso: renderizar `honeypot` dentro del <form> y sumar `guard()` al body.
export function useLeadGuard() {
  const startedAt = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  function guard(): LeadGuard {
    return {
      _hp: inputRef.current?.value ?? "",
      _elapsed: startedAt.current === null ? 0 : Date.now() - startedAt.current,
    };
  }

  function resetTimer() {
    startedAt.current = Date.now();
  }

  const honeypot = (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        left: "-10000px",
        width: 1,
        height: 1,
        overflow: "hidden",
      }}
    >
      <label>
        Website
        <input
          ref={inputRef}
          type="text"
          name={HONEYPOT_FIELD}
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </label>
    </div>
  );

  return { honeypot, guard, resetTimer };
}
