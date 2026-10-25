import { View } from "react-native";
import Svg, { Line, Rect, Text as SvgText } from "react-native-svg";

import { colors } from "@/design-system/theme";

export type Bar = { label: string; value: number };

type BarChartProps = {
  data: Bar[];
  className?: string;
};

const W = 350;
const H = 178;
const PLOT_LEFT = 38;
const PLOT_RIGHT = 348;
const PLOT_TOP = 30;
const BASELINE = 140;

const NICE_STEPS = [
  100, 200, 250, 500, 1000, 1500, 2000, 2500, 3000, 5000, 7500, 10000, 15000, 20000,
];

/** Largest nice number divisible by 3 that clears the data, so thirds label cleanly. */
function niceMax(values: number[]): number {
  const raw = Math.max(...values, 0);
  if (raw <= 0) return 300;
  const third = raw / 3;
  const step = NICE_STEPS.find((s) => s >= third) ?? Math.ceil(third / 10000) * 10000;
  return step * 3;
}

function formatAxis(v: number): string {
  if (v === 0) return "0";
  if (v >= 1000) {
    const k = v / 1000;
    return `${Number.isInteger(k) ? k : k.toFixed(1)}k`;
  }
  return `${Math.round(v)}`;
}

/**
 * The one chart in the app: weekly volume as accent bars over a labelled
 * baseline. Straight SVG borrowed from the demo's geometry.
 */
export function BarChart({ data, className = "" }: BarChartProps) {
  const max = niceMax(data.map((d) => d.value));
  const yFor = (v: number) => BASELINE - (v / max) * (BASELINE - PLOT_TOP);
  const gridValues = [max, (max * 2) / 3, max / 3, 0];

  const plotWidth = PLOT_RIGHT - PLOT_LEFT;
  const slot = plotWidth / Math.max(data.length, 1);
  const barWidth = Math.min(24, slot * 0.6);
  const labelEvery = Math.max(1, Math.ceil(data.length / 4));

  return (
    <View className={className} style={{ aspectRatio: 350 / 178 }}>
      <Svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`}>
        {gridValues.map((v) => (
          <Line
            key={`grid-${v}`}
            x1={PLOT_LEFT}
            y1={yFor(v)}
            x2={PLOT_RIGHT}
            y2={yFor(v)}
            stroke={v === 0 ? colors.control : colors.grid}
            strokeWidth={1}
          />
        ))}
        {gridValues.map((v) => (
          <SvgText
            key={`label-${v}`}
            x={PLOT_LEFT - 4}
            y={yFor(v) + 4}
            fill={colors.faint}
            fontSize={11}
            textAnchor="end"
          >
            {formatAxis(v)}
          </SvgText>
        ))}
        {data.map((d, i) => (
          <Rect
            key={`${d.label}-${i}`}
            x={PLOT_LEFT + i * slot + (slot - barWidth) / 2}
            y={yFor(d.value)}
            width={barWidth}
            height={BASELINE - yFor(d.value)}
            fill={colors.accent}
          />
        ))}
        {data.map((d, i) =>
          i % labelEvery === 0 ? (
            <SvgText
              key={`x-${i}`}
              x={PLOT_LEFT + i * slot + slot / 2}
              y={BASELINE + 20}
              fill={colors.faint}
              fontSize={11}
              textAnchor="middle"
            >
              {d.label}
            </SvgText>
          ) : null,
        )}
      </Svg>
    </View>
  );
}
