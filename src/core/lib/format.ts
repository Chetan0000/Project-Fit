/** Pure formatting helpers shared across screens. */

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** "2026-10-14" → "14 Oct 2026". Falls back to the input if unparseable. */
export function formatIsoDate(iso: string): string {
  const [year, month, day] = iso.split("-").map((part) => Number.parseInt(part, 10));
  if (!year || !month || !day) return iso;
  return `${day} ${MONTHS[month - 1] ?? ""} ${year}`.trim();
}

/** 3190 → "3,190". */
export function formatThousands(value: number): string {
  return Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/** 6, 8 → "6–8"; 8, 8 → "8". */
export function formatRepRange(min: number, max: number): string {
  return min === max ? `${max}` : `${min}–${max}`;
}

/** 70 → "70.0 kg"; 0 → "Bodyweight". */
export function formatWeight(kg: number): string {
  return kg > 0 ? `${kg.toFixed(1)} kg` : "Bodyweight";
}

/** -0.0417 → "-4.2%". */
export function formatSignedPercent(value: number): string {
  const pct = (value * 100).toFixed(1);
  return value > 0 ? `+${pct}%` : `${pct}%`;
}
