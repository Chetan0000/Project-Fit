import { Pressable, Text, View } from "react-native";

import type { SplitDay } from "@/core/api/types";

type SplitRowProps = {
  day: SplitDay;
  /** Provided by the draggable list to start a drag on long press. */
  onLongPress?: () => void;
  active?: boolean;
};

/** One day of the rolling cycle: grip, name, exercise summary, set count. */
export function SplitRow({ day, onLongPress, active = false }: SplitRowProps) {
  const subtitle =
    day.category === "rest"
      ? "No session"
      : day.exercises.map((exercise) => exercise.name).join(", ");

  return (
    <Pressable
      onLongPress={onLongPress}
      delayLongPress={150}
      className={[
        "min-h-[52px] flex-row items-center gap-3 rounded-card bg-surface px-[14px] py-2",
        active ? "opacity-90" : "",
      ].join(" ")}
    >
      <Text className="font-sans text-[14px] leading-none text-faint">⋮⋮</Text>
      <View className="min-w-0 flex-1">
        <Text className="font-inter-medium text-[15px] text-text">{day.name}</Text>
        <Text className="mt-[1px] font-sans text-[13px] text-muted" numberOfLines={1}>
          {subtitle}
        </Text>
      </View>
      <Text
        className="font-sans text-[13px] text-muted"
        style={{ fontVariant: ["tabular-nums"] }}
      >
        {day.exercises.length}
      </Text>
    </Pressable>
  );
}
