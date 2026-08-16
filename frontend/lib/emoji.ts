// Backend product data doesn't carry a decorative emoji field — mapped client-side by name.
const EMOJI_BY_NAME: Record<string, string> = {
  "Strawberry Dream": "🍓",
  "Blueberry Bliss": "🫐",
  "Orange Burst": "🍊",
  "Mint Fresh": "🌿",
  "Coffee Delight": "☕",
  "Vanilla Bliss": "🌼",
};

export function productEmoji(name: string): string {
  return EMOJI_BY_NAME[name] ?? "🍬";
}
