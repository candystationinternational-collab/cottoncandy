// Generated cotton-candy SVG art: a fluffy cloud of ellipses in the product's
// CandyColor on a cream backdrop, with a gold stick — ported from the PRD's
// described generateScoopSVG approach. No raster gradients used (solid fills,
// opacity layering only for the "fluffy" effect).

function shade(hex: string, amount: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  let r = (num >> 16) + amount;
  let g = ((num >> 8) & 0x00ff) + amount;
  let b = (num & 0x0000ff) + amount;
  r = Math.max(Math.min(255, r), 0);
  g = Math.max(Math.min(255, g), 0);
  b = Math.max(Math.min(255, b), 0);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

const PUFFS = [
  { cx: 130, cy: 150, rx: 62, ry: 48, rot: -12 },
  { cx: 200, cy: 120, rx: 70, ry: 54, rot: 6 },
  { cx: 270, cy: 148, rx: 60, ry: 46, rot: 14 },
  { cx: 160, cy: 100, rx: 52, ry: 40, rot: -6 },
  { cx: 235, cy: 95, rx: 50, ry: 38, rot: 4 },
  { cx: 200, cy: 175, rx: 78, ry: 50, rot: 0 },
];

export function CandyArt({
  color,
  className,
}: {
  color: string;
  className?: string;
  id: string;
}) {
  const light = shade(color, 55);
  const dark = shade(color, -25);

  return (
    <svg
      viewBox="0 0 400 420"
      className={className}
      role="img"
      aria-label="Cotton candy illustration"
    >
      {/* color-matched glow behind the art — solid-fill concentric circles, no gradient */}
      <circle cx="200" cy="150" r="170" fill={color} opacity="0.08" />
      <circle cx="200" cy="150" r="120" fill={color} opacity="0.1" />
      <circle cx="200" cy="150" r="75" fill={color} opacity="0.12" />

      {/* gold stick */}
      <rect x="192" y="230" width="16" height="150" rx="8" fill="#E8B547" />
      <rect x="192" y="230" width="6" height="150" rx="3" fill="#F6D07C" />

      {/* fluffy cloud */}
      <g data-candy-puffs>
        {PUFFS.map((p, i) => (
          <ellipse
            key={i}
            cx={p.cx}
            cy={p.cy}
            rx={p.rx}
            ry={p.ry}
            fill={i % 2 === 0 ? color : dark}
            opacity={0.92}
            transform={`rotate(${p.rot} ${p.cx} ${p.cy})`}
          />
        ))}
        {/* highlight puffs */}
        <ellipse cx="175" cy="105" rx="30" ry="22" fill={light} opacity="0.85" />
        <ellipse cx="255" cy="130" rx="24" ry="18" fill={light} opacity="0.7" />
        <ellipse cx="150" cy="165" rx="20" ry="15" fill="#ffffff" opacity="0.55" />
      </g>
    </svg>
  );
}
