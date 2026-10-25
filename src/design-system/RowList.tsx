import type { ReactNode } from "react";
import { View, Text } from "react-native";

type RowListProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Hairline-separated row group. The 1px gaps expose the container's rule
 * colour, so no per-row border bookkeeping is needed.
 */
export function RowList({ children, className = "" }: RowListProps) {
  return (
    <View className={["gap-[1px] overflow-hidden rounded-card bg-rule", className].join(" ")}>
      {children}
    </View>
  );
}

type RowProps = {
  children: ReactNode;
  className?: string;
};

/** One row inside a `RowList`. */
export function Row({ children, className = "" }: RowProps) {
  return (
    <View
      className={[
        "min-h-[56px] flex-row items-center gap-3 bg-surface px-4 py-[10px]",
        className,
      ].join(" ")}
    >
      {children}
    </View>
  );
}

type RowGrowProps = {
  title: string;
  subtitle?: string;
  className?: string;
};

/** The flexible middle of a row: a name and an optional tabular meta line. */
export function RowGrow({ title, subtitle, className = "" }: RowGrowProps) {
  return (
    <View className={["min-w-0 flex-1", className].join(" ")}>
      <Text className="font-inter-medium text-[15px] text-text">{title}</Text>
      {subtitle ? (
        <Text
          className="mt-[2px] font-sans text-[13px] text-muted"
          style={{ fontVariant: ["tabular-nums"] }}
        >
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

type RowValueProps = {
  value: string;
  /** `accent` = completed (lime), `muted` = nothing logged yet. */
  tone?: "default" | "accent" | "muted";
};

/** The trailing value of a row. */
export function RowValue({ value, tone = "default" }: RowValueProps) {
  const toneClass =
    tone === "accent"
      ? "text-accent font-inter-medium"
      : tone === "muted"
        ? "text-faint font-sans"
        : "text-text font-inter-medium";

  return (
    <Text
      className={["text-[15px]", toneClass].join(" ")}
      style={{ fontVariant: ["tabular-nums"] }}
    >
      {value}
    </Text>
  );
}
