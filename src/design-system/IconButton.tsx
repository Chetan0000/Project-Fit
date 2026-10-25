import { Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";

import { colors } from "@/design-system/theme";

type IconButtonProps = {
  icon: keyof typeof Feather.glyphMap;
  accessibilityLabel: string;
  onPress?: () => void;
  size?: number;
  className?: string;
};

/** Round, quiet icon button used in screen headers. */
export function IconButton({
  icon,
  accessibilityLabel,
  onPress,
  size = 18,
  className = "",
}: IconButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      className={[
        "h-[34px] w-[34px] items-center justify-center rounded-control active:bg-raised",
        className,
      ].join(" ")}
    >
      <Feather name={icon} size={size} color={colors.muted} />
    </Pressable>
  );
}
