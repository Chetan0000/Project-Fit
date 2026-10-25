import type { ReactNode } from "react";
import { View, Text } from "react-native";

import { colors } from "@/design-system/theme";

type KpiStripProps = {
  children: ReactNode;
  className?: string;
};

/** One container, equal columns, hairline dividers between cells. */
export function KpiStrip({ children, className = "" }: KpiStripProps) {
  return (
    <View
      className={["flex-row gap-[1px] overflow-hidden rounded-card bg-border", className].join(
        " ",
      )}
    >
      {children}
    </View>
  );
}

type KpiProps = {
  label: string;
  value: string;
  /** Appended small caption, e.g. `/16`, ` kg`, ` sessions`. */
  suffix?: string;
  tone?: "default" | "accent";
};

/** One KPI cell: small muted label over a large tabular value. */
export function Kpi({ label, value, suffix, tone = "default" }: KpiProps) {
  return (
    <View className="min-w-0 flex-1 bg-surface px-4 py-[14px]">
      <Text className="font-sans text-[13px] text-muted">{label}</Text>
      <Text
        className="mt-[5px] font-inter-medium text-[22px] leading-[1.1]"
        style={{ color: tone === "accent" ? colors.accent : colors.text, fontVariant: ["tabular-nums"] }}
      >
        {value}
        {suffix ? <Text className="font-sans text-[13px] text-muted">{suffix}</Text> : null}
      </Text>
    </View>
  );
}
