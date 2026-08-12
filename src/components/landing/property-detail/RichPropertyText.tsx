function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function restoreAllowedInlineMarkup(value: string) {
  return value
    .replace(/&lt;(\/?(?:strong|b|em|i))&gt;/gi, "<$1>")
    .replace(/&lt;br\s*\/?&gt;/gi, "<br />")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}

export function toPlainPropertyText(value: string) {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/\*\*/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function toSafePropertyHtml(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";

  const escaped = restoreAllowedInlineMarkup(escapeHtml(trimmed));
  const hasParagraphTags = /&lt;\/?p&gt;/i.test(escapeHtml(trimmed));

  if (hasParagraphTags) {
    return escaped
      .replace(/&lt;p&gt;/gi, '<p class="mb-5">')
      .replace(/&lt;\/p&gt;/gi, "</p>");
  }

  return escaped
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => `<p class="mb-5">${paragraph.replace(/\n/g, "<br />")}</p>`)
    .join("");
}

export function RichPropertyText({ value }: { value: string }) {
  const html = toSafePropertyHtml(value);
  if (!html) return null;

  return (
    <div
      className="text-base leading-8 text-secondary [&_strong]:font-semibold [&_strong]:text-primary"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
