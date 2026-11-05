import { SITE_NAME } from "@/lib/seo";

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char] as string,
  );
}

// Email transaccional simple: saludo, párrafos, un botón y notas al pie.
export function buildActionEmail(input: {
  name: string | null;
  paragraphs: string[];
  action?: { label: string; url: string };
  footnotes?: string[];
}) {
  const greeting = input.name ? `Hola ${input.name},` : "Hola,";
  const footnotes = input.footnotes ?? [];

  const text = [
    greeting,
    "",
    ...input.paragraphs,
    ...(input.action ? ["", input.action.url] : []),
    ...(footnotes.length ? ["", ...footnotes] : []),
  ].join("\n");

  const html = `<!doctype html><html><body style="margin:0;background:#f5f3ef;font-family:Arial,sans-serif;color:#1a1a1a">
<div style="max-width:520px;margin:0 auto;padding:32px 24px">
<p style="font-size:18px;margin:0 0 24px"><strong>${escapeHtml(SITE_NAME)}</strong></p>
<p>${escapeHtml(greeting)}</p>
${input.paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join("\n")}
${
  input.action
    ? `<p style="margin:28px 0"><a href="${escapeHtml(input.action.url)}" style="background:#0a0a0a;color:#fafaf8;padding:14px 22px;text-decoration:none;border-radius:2px;display:inline-block">${escapeHtml(input.action.label)}</a></p>`
    : ""
}
${footnotes.map((f) => `<p style="font-size:14px;color:#555">${escapeHtml(f)}</p>`).join("\n")}
${
  input.action
    ? `<p style="font-size:12px;color:#888;word-break:break-all">Si el botón no funciona, copiá este link: ${escapeHtml(input.action.url)}</p>`
    : ""
}
</div></body></html>`;

  return { text, html };
}
