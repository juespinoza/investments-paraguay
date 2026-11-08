import { Fragment, type ReactNode } from "react";
import { CalendarDays, Download, Info } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import type {
  ArticleBlock,
  LocalizedArticle,
} from "@/lib/content/articles/types";
import { SCHEDULE_CALL_URL, buildWhatsAppMessageHref } from "@/lib/contact";
import { Link } from "@/i18n/navigation";

// Texto con **negrita** y [enlaces](https://...) o [internos](/blog/...).
// Los internos usan el Link de next-intl: mantienen el idioma de la página.
// Solo para contenido propio.
export function RichInline({ text }: { text: string }) {
  const parts: ReactNode[] = [];
  const pattern = /\*\*(.+?)\*\*|\[([^\]]+)\]\(((?:https?:\/\/|\/)[^)\s]+)\)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    if (match[1]) {
      parts.push(
        <strong key={key++} className="font-semibold text-primary">
          {match[1]}
        </strong>,
      );
    } else if (match[3].startsWith("/")) {
      parts.push(
        <Link
          key={key++}
          href={match[3]}
          className="text-primary underline decoration-(--gold) underline-offset-4 hover:text-(--gold)"
        >
          {match[2]}
        </Link>,
      );
    } else {
      parts.push(
        <a
          key={key++}
          href={match[3]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline decoration-(--gold) underline-offset-4 hover:text-(--gold)"
        >
          {match[2]}
        </a>,
      );
    }
    last = pattern.lastIndex;
  }

  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}

function ArticleCta({ cta }: { cta: LocalizedArticle["cta"] }) {
  return (
    <aside className="my-10 rounded-lg border border-(--gold) bg-[rgba(191,168,130,0.12)] p-6 md:p-8">
      <p className="font-cormorant text-[26px] leading-tight text-primary">
        {cta.title}
      </p>
      <p className="mt-2 text-[15px] leading-7 text-secondary">{cta.text}</p>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <a
          href={SCHEDULE_CALL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-xs bg-(--carbon) px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.06em] text-(--ivory) transition-colors hover:bg-(--gold) hover:text-(--carbon)"
          data-analytics-event="schedule_call_click"
          data-analytics-category="contact"
          data-analytics-location="article_cta"
        >
          <CalendarDays size={16} strokeWidth={1.8} aria-hidden="true" />
          {cta.call}
        </a>
        <a
          href={buildWhatsAppMessageHref(cta.whatsappMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-xs bg-(--gold) px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.06em] text-(--carbon) transition-colors hover:bg-(--carbon) hover:text-(--ivory)"
          data-analytics-label="article_whatsapp"
          data-analytics-location="article_cta"
        >
          <FaWhatsapp size={16} aria-hidden="true" />
          {cta.whatsapp}
        </a>
        <a
          href="#guia"
          className="inline-flex items-center justify-center gap-2 rounded-xs border border-(--line) px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.06em] text-primary transition-colors hover:border-(--gold) hover:text-(--gold)"
          data-analytics-event="cta_click"
          data-analytics-category="lead_magnet"
          data-analytics-label="guide_anchor"
          data-analytics-location="article_cta"
        >
          <Download size={16} strokeWidth={1.8} aria-hidden="true" />
          {cta.guide}
        </a>
      </div>
    </aside>
  );
}

function Block({
  block,
  cta,
}: {
  block: ArticleBlock;
  cta: LocalizedArticle["cta"];
}) {
  switch (block.type) {
    case "h2":
      return (
        <h2
          id={block.id}
          className="mb-4 mt-12 scroll-mt-24 font-cormorant text-[30px] font-normal leading-tight text-primary md:text-[34px]"
        >
          {block.text}
        </h2>
      );
    case "p":
      return (
        <p className="mb-5 text-base leading-8 text-secondary">
          <RichInline text={block.text} />
        </p>
      );
    case "ul":
    case "ol": {
      const List = block.type === "ul" ? "ul" : "ol";
      return (
        <List
          className={
            block.type === "ul"
              ? "mb-6 list-disc space-y-3 pl-6 text-base leading-8 text-secondary marker:text-(--gold)"
              : "mb-6 list-decimal space-y-3 pl-6 text-base leading-8 text-secondary marker:font-semibold marker:text-(--gold)"
          }
        >
          {block.items.map((item) => (
            <li key={item} className="pl-1">
              <RichInline text={item} />
            </li>
          ))}
        </List>
      );
    }
    case "table":
      return (
        <div className="mb-6">
          <div className="overflow-x-auto rounded-lg border border-(--line)">
            <table className="w-full min-w-120 text-left text-[14px]">
              <thead className="bg-(--stone) text-[12px] uppercase tracking-[0.06em] text-muted">
                <tr>
                  {block.head.map((cell) => (
                    <th key={cell} className="px-4 py-3 font-semibold">
                      {cell}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row) => (
                  <tr key={row.join("|")} className="border-t border-(--line)">
                    {row.map((cell, index) => (
                      <td
                        key={`${index}-${cell}`}
                        className={
                          index === 0
                            ? "px-4 py-3 font-medium text-primary"
                            : "px-4 py-3 text-secondary"
                        }
                      >
                        <RichInline text={cell} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {block.note ? (
            <p className="mt-2 text-[12px] text-muted">{block.note}</p>
          ) : null}
        </div>
      );
    case "callout":
      return (
        <div className="mb-6 flex gap-3 rounded-lg border border-(--line) bg-(--stone) p-5">
          <Info
            size={20}
            strokeWidth={1.8}
            className="mt-1 shrink-0 text-(--gold)"
            aria-hidden="true"
          />
          <div>
            <p className="text-[15px] font-semibold text-primary">
              {block.title}
            </p>
            <p className="mt-1 text-[15px] leading-7 text-secondary">
              <RichInline text={block.text} />
            </p>
          </div>
        </div>
      );
    case "cta":
      return <ArticleCta cta={cta} />;
  }
}

export function ArticleBody({ article }: { article: LocalizedArticle }) {
  return (
    <>
      {article.blocks.map((block, index) => (
        <Fragment key={index}>
          <Block block={block} cta={article.cta} />
        </Fragment>
      ))}
    </>
  );
}
