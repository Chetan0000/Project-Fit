import { View, Text } from "react-native";

export type CycleDay = {
  label: string;
  /** Rest days render faint. */
  rest?: boolean;
};

type CycleStripProps = {
  days: CycleDay[];
  /** Index of the day the cycle is currently on (accent-filled pill). */
  todayIndex?: number;
  className?: string;
};

/**
 * The product's signature element: the rolling Push / Pull / Legs cycle as a
 * strip of pills. Today is the only place the accent hue appears here.
 */
export function CycleStrip({ days, todayIndex, className = "" }: CycleStripProps) {
  return (
    <View className={["flex-row flex-wrap gap-2", className].join(" ")}>
      {days.map((day, i) => {
        const isToday = i === todayIndex;
        const textClass = isToday
          ? "font-inter-semibold text-accent-ink"
          : day.rest
            ? "font-inter-medium text-faint"
            : "font-inter-medium text-muted";

        return (
          <View
            key={`${day.label}-${i}`}
            className={[
              "rounded-control border px-3 py-[7px]",
              isToday ? "border-accent bg-accent" : "border-border bg-surface",
            ].join(" ")}
          >
            <Text className={["text-[13px]", textClass].join(" ")}>{day.label}</Text>
          </View>
        );
      })}
    </View>
  );
}
