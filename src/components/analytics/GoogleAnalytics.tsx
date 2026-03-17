"use client";

import Script from "next/script";
import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  AnalyticsEventPayload,
  GA_MEASUREMENT_ID,
  isAnalyticsEnabled,
} from "@/lib/analytics";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function trackPageView(path: string, locale: string) {
  if (!window.gtag || !GA_MEASUREMENT_ID) return;

  window.gtag("event", "page_view", {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
    language: navigator.language,
    locale,
  });
}

function trackAnalyticsEvent(payload: AnalyticsEventPayload) {
  if (!window.gtag) return;

  window.gtag("event", payload.event, {
    event_category: payload.category,
    event_label: payload.label,
    value: payload.value,
    location: payload.location,
    link_url: payload.href,
    locale: payload.locale,
    page_path: payload.path,
  });
}

export default function GoogleAnalytics({ locale }: { locale: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!isAnalyticsEnabled()) return;

    const qs = searchParams.toString();
    const path = qs ? `${pathname}?${qs}` : pathname;

    if (window.gtag) {
      window.gtag("set", "user_properties", {
        locale,
        browser_language: navigator.language,
      });
    }

    trackPageView(path, locale);
  }, [locale, pathname, searchParams]);

  useEffect(() => {
    if (!isAnalyticsEnabled()) return;

    function onClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const tracked = target.closest<HTMLElement>("[data-analytics-event]");
      if (!tracked) return;

      const path = searchParams.toString()
        ? `${pathname}?${searchParams.toString()}`
        : pathname;

      const href =
        tracked instanceof HTMLAnchorElement
          ? tracked.href
          : tracked.getAttribute("href") ?? undefined;

      trackAnalyticsEvent({
        event: tracked.dataset.analyticsEvent ?? "ui_click",
        category: tracked.dataset.analyticsCategory ?? undefined,
        label: tracked.dataset.analyticsLabel ?? undefined,
        location: tracked.dataset.analyticsLocation ?? undefined,
        href,
        locale,
        path,
      });
    }

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [locale, pathname, searchParams]);

  if (!isAnalyticsEnabled()) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            send_page_view: false
          });
        `}
      </Script>
    </>
  );
}
