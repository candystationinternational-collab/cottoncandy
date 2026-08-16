export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 20,
}: {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="inline-flex items-center rounded-full border-2 border-navy">
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => onChange(Math.max(min, value - 1))}
        className="flex h-10 w-10 items-center justify-center text-lg font-bold text-navy hover:text-pink"
      >
        −
      </button>
      <span className="w-8 text-center text-sm font-bold text-navy">{value}</span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange(Math.min(max, value + 1))}
        className="flex h-10 w-10 items-center justify-center text-lg font-bold text-navy hover:text-pink"
      >
        +
      </button>
    </div>
  );
}
