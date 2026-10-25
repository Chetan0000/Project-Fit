import Svg, { Path } from "react-native-svg";

import { colors } from "@/design-system/theme";

type MarkProps = {
  size?: number;
  color?: string;
};

/** The FitForge brand mark (a barbell glyph), drawn to match the demo. */
export function Mark({ size = 22, color = colors.accent }: MarkProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M4 9.5v5M7.5 6.5v11M16.5 6.5v11M20 9.5v5M7.5 12h9"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
}
