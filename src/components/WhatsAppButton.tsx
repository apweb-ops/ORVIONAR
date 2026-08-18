import { MessageCircle } from "lucide-react";
import { whatsappLink } from "@/lib/site";
import { track } from "@/lib/analytics";

export function WhatsAppButton() {
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track("whatsapp_clicked", "floating")}
      className="fixed right-4 bottom-4 z-50 inline-flex items-center gap-2 rounded-full bg-[oklch(0.68_0.17_150)] px-4 py-3 text-sm font-semibold text-white shadow-lg transition-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      aria-label="Chat with ORVIONAR admissions on WhatsApp"
    >
      <MessageCircle className="size-5" aria-hidden="true" />
      <span className="hidden sm:inline">Chat with Admissions</span>
    </a>
  );
}
