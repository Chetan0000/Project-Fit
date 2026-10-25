import type { ReactNode } from "react";
import { View, Text } from "react-native";

type ScreenHeaderProps = {
  /** Left slot — a brand cluster or a back button. */
  left?: ReactNode;
  /** Optional centred title. */
  title?: string;
  /** Right slot — options / actions. */
  right?: ReactNode;
  className?: string;
};

/** The 48px app bar: no rule, quiet chrome, three slots. */
export function ScreenHeader({ left, title, right, className = "" }: ScreenHeaderProps) {
  return (
    <View
      className={["h-12 flex-row items-center justify-between px-5", className].join(" ")}
    >
      <View className="min-w-[34px] flex-row items-center">{left}</View>
      {title ? (
        <Text className="font-inter-semibold text-[15px] text-text">{title}</Text>
      ) : null}
      <View className="min-w-[34px] flex-row items-center justify-end">{right}</View>
    </View>
  );
}
