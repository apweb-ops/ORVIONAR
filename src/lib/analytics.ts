import { supabase } from "@/integrations/supabase/client";

/**
 * Privacy-conscious analytics hook point.
 * Events carry no personal data — only the interaction name and non-identifying labels.
 * Wire this to a provider later by listening for the "orv:analytics" window event.
 */
export type AnalyticsEvent =
  | "page_view"
  | "program_viewed"
  | "enroll_clicked"
  | "admission_form_started"
  | "admission_form_completed"
  | "application_submitted"
  | "whatsapp_clicked"
  | "linkedin_clicked"
  | "lms_clicked"
  | "contact_submitted";

function getVisitorId() {
  if (typeof window === "undefined") return undefined;
  const key = "orvionar_visitor_id";
  const existing = window.localStorage.getItem(key);
  if (existing) return existing;
  const id = crypto.randomUUID();
  window.localStorage.setItem(key, id);
  return id;
}

export function track(event: AnalyticsEvent, label?: string) {
  if (typeof window === "undefined") return;
  const detail = { event, label, at: new Date().toISOString() };
  window.dispatchEvent(new CustomEvent("orv:analytics", { detail }));
  void supabase.rpc("record_analytics_event", {
    event_name: event,
    event_label: label,
    event_path: window.location.pathname,
    event_visitor_id: getVisitorId(),
  });
  if (import.meta.env.DEV) console.debug("[analytics]", detail);
}
