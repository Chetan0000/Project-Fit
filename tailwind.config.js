/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // ── Surfaces (True-black flat direction) ──
        bg: "#000000",
        surface: "#111111",
        raised: "#2A2A2A",
        active: "#222222",
        border: "#1A1A1A",
        rule: "#161616",
        control: "#444444",
        // ── Text ──
        text: "#FFFFFF",
        muted: "#B4B4B4",
        faint: "#949494",
        // ── Accent (lime) — data marks and active state only ──
        accent: "#C6F24E",
        "accent-ink": "#000000",
        // ── The one filled CTA is white ──
        primary: "#FFFFFF",
        "primary-ink": "#000000",
        // ── Semantic ──
        positive: "#C6F24E",
        negative: "#E5484D",
        warning: "#E5A93B",
        // ── Chart / chrome ──
        grid: "#2B2B2B",
        "tab-idle": "#BBBBBB",
        // ── Legacy tokens (earlier multi-colour direction, unused) ──
        push: "#60A5FA",
        pull: "#A78BFA",
        legs: "#FB923C",
        "push-bg": "#0D1825",
        "pull-bg": "#1A0D25",
        "legs-bg": "#250D0D",
        "warn-bg": "#1A1500",
        "warn-border": "#3D3000",
        "warn-text": "#F5C542",
      },
      fontFamily: {
        // Inter families (loaded in app/_layout.tsx).
        // Named distinctly so they never collide with Tailwind font-weight utilities.
        sans: ["Inter_400Regular"],
        "inter-medium": ["Inter_500Medium"],
        "inter-semibold": ["Inter_600SemiBold"],
      },
      borderRadius: {
        xl: "14px",
        "2xl": "16px",
        "3xl": "20px",
        "4xl": "24px",
        card: "20px",
        control: "999px",
      },
    },
  },
  plugins: [],
};
