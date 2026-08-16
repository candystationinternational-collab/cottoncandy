// wa.me deep link requires the number in international format, digits only (no "+").
export const WHATSAPP_NUMBER = "9779749839818";

export function buildWhatsAppOrderLink(lines: { name: string; variant?: string; quantity: number }[]): string {
  const itemLines = lines
    .map((l) => `- ${l.quantity} x ${l.name}${l.variant ? ` (${l.variant})` : ""}`)
    .join("\n");
  const message = `Hi Candy Station! I'd like to order:\n${itemLines}\n\nPlease confirm availability and delivery details.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
