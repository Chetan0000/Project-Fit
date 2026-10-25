import { Pressable, View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";

import { colors } from "@/design-system/theme";

type StepperProps = {
  label: string;
  value: string;
  onDecrement?: () => void;
  onIncrement?: () => void;
  className?: string;
};

/** Weight / reps adjuster: label, then a −/+ pair around a tabular value. */
export function Stepper({
  label,
  value,
  onDecrement,
  onIncrement,
  className = "",
}: StepperProps) {
  return (
    <View className={["gap-2 rounded-card bg-surface px-3 py-[10px]", className].join(" ")}>
      <Text className="font-sans text-xs text-muted">{label}</Text>
      <View className="flex-row items-center justify-between">
        <Pressable
          accessibilityLabel={`Less ${label}`}
          onPress={onDecrement}
          className="h-[30px] w-[30px] items-center justify-center rounded-[9px] bg-raised active:bg-active"
        >
          <Feather name="minus" size={16} color={colors.text} />
        </Pressable>
        <Text
          className="font-inter-semibold text-[18px] text-text"
          style={{ fontVariant: ["tabular-nums"] }}
        >
          {value}
        </Text>
        <Pressable
          accessibilityLabel={`More ${label}`}
          onPress={onIncrement}
          className="h-[30px] w-[30px] items-center justify-center rounded-[9px] bg-raised active:bg-active"
        >
          <Feather name="plus" size={16} color={colors.text} />
        </Pressable>
      </View>
    </View>
  );
}
