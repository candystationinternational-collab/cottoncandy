import { buildWhatsAppOrderLink } from "@/lib/whatsapp";

export function WhatsAppOrderButton({
  itemName,
  variantName,
  quantity,
  className,
}: {
  itemName: string;
  variantName?: string;
  quantity: number;
  className?: string;
}) {
  const href = buildWhatsAppOrderLink([{ name: itemName, variant: variantName, quantity }]);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={
        className ??
        "flex items-center justify-center gap-2 rounded-full border-2 border-lime px-6 py-3 text-sm font-bold uppercase tracking-wide text-navy transition-colors hover:bg-lime hover:text-white"
      }
    >
      <WhatsAppIcon />
      Order via WhatsApp
    </a>
  );
}

export function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.29-1.39a9.9 9.9 0 0 0 4.75 1.21h.01c5.46 0 9.9-4.45 9.9-9.91C21.96 6.45 17.5 2 12.04 2Zm5.8 14.1c-.24.68-1.4 1.3-1.93 1.38-.5.08-1.12.11-1.8-.11-.42-.13-.95-.31-1.64-.6-2.88-1.24-4.76-4.15-4.9-4.34-.14-.19-1.17-1.56-1.17-2.97 0-1.42.74-2.11 1-2.4.26-.29.57-.36.76-.36.19 0 .38 0 .55.01.18.01.42-.07.65.5.24.58.82 2 .89 2.14.07.14.12.31.02.5-.09.19-.14.31-.28.48-.14.17-.29.37-.42.5-.14.14-.28.29-.12.57.16.28.71 1.17 1.53 1.9 1.05.94 1.94 1.23 2.22 1.37.28.14.44.12.6-.07.17-.19.71-.83.9-1.11.19-.29.38-.24.64-.14.26.09 1.66.78 1.94.93.28.14.47.21.54.33.07.12.07.68-.17 1.36Z" />
    </svg>
  );
}
