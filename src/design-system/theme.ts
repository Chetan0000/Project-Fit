/**
 * Design tokens for the "True-black flat" direction, ported from design/ui-demo.html.
 *
 * Use these when a raw color/font value is needed in TS (icon `color` props,
 * StatusBar, Reanimated styles, SVG props, react-navigation options). For layout
 * and styling inside components, prefer NativeWind classNames (see tailwind.config.js),
 * which are generated from these same values.
 *
 * The direction is single-hue: elevation comes from lightness alone, and the lime
 * accent appears only on data marks and active state. The one filled CTA is white.
 */

export const colors = {
  // Surfaces
  bg: "#000000",
  surface: "#111111",
  raised: "#2A2A2A",
  active: "#222222",
  border: "#1A1A1A",
  rule: "#161616",
  control: "#444444",

  // Text
  text: "#FFFFFF",
  muted: "#B4B4B4",
  faint: "#949494",

  // Accent (lime) — data marks and active state only
  accent: "#C6F24E",
  accentInk: "#000000",

  // The filled CTA is white, not the accent hue
  primary: "#FFFFFF",
  primaryInk: "#000000",

  // Semantic
  positive: "#C6F24E",
  negative: "#E5484D",
  warning: "#E5A93B",

  // Chart
  grid: "#2B2B2B",
  tabIdle: "#BBBBBB",

  // ── Legacy tokens ──
  // From the earlier multi-colour direction. Unused by the current single-hue
  // design; kept so nothing documented is silently lost.
  push: "#60A5FA",
  pull: "#A78BFA",
  legs: "#FB923C",
  pushBg: "#0D1825",
  pullBg: "#1A0D25",
  legsBg: "#250D0D",
  warnBg: "#1A1500",
  warnBorder: "#3D3000",
  warnText: "#F5C542",
} as const;

export const fonts = {
  regular: "Inter_400Regular",
  medium: "Inter_500Medium",
  semibold: "Inter_600SemiBold",
} as const;

/** The three training categories plus rest days. */
export type CategoryType = "push" | "pull" | "legs" | "rest";

/** Maps a category to its accent color + tinted background. */
export const categoryColor: Record<
  CategoryType,
  { fg: string; bg: string }
> = {
  push: { fg: colors.push, bg: colors.pushBg },
  pull: { fg: colors.pull, bg: colors.pullBg },
  legs: { fg: colors.legs, bg: colors.legsBg },
  rest: { fg: colors.muted, bg: colors.raised },
};
