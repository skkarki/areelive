// Lightweight, provider-agnostic analytics helper.
// Dispatches to window.dataLayer (Google Tag Manager / GA4),
// window.plausible if present, and a CustomEvent on window so any
// listener (Segment, PostHog, custom dashboards) can pick it up.
// Also logs to console in dev for verification.

export type AnalyticsEvent =
  | "download_click"
  | "email_signup_submit"
  | "email_signup_success"
  | "page_view";

export interface AnalyticsPayload {
  platform?: "web" | "ios" | "android";
  location?: string;
  [key: string]: unknown;
}

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    plausible?: (event: string, options?: { props?: Record<string, unknown> }) => void;
  }
}

export function trackEvent(event: AnalyticsEvent, payload: AnalyticsPayload = {}) {
  if (typeof window === "undefined") return;

  const detail = { event, ...payload, ts: Date.now() };

  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(detail);

    if (typeof window.plausible === "function") {
      window.plausible(event, { props: payload });
    }

    window.dispatchEvent(new CustomEvent("areelive:analytics", { detail }));

    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.info("[analytics]", event, payload);
    }
  } catch {
    // never let analytics break the UI
  }
}