import { Pressable, Text } from "react-native";

import { colors } from "@/design-system/theme";

type Variant = "primary" | "outline";
type Size = "sm" | "md";

type ButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  /** Stretch to the parent width (the direction's `block` CTAs). */
  fullWidth?: boolean;
  disabled?: boolean;
  /** Extra NativeWind classes (e.g. margins) from the caller. */
  className?: string;
};

const SIZE_CLASS: Record<Size, string> = {
  sm: "h-[34px] px-[14px]",
  md: "h-[48px] px-[18px]",
};

/**
 * The direction's button. One filled variant only — white in the dark theme —
 * plus an outlined counterpart. Press nudges down 1px like the CSS `:active`.
 */
export function Button({
  label,
  onPress,
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled = false,
  className = "",
}: ButtonProps) {
  const isPrimary = variant === "primary";

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        {
          transform: [{ translateY: pressed && !disabled ? 1 : 0 }],
          opacity: disabled ? 0.4 : 1,
        },
        !isPrimary && pressed && !disabled ? { backgroundColor: colors.raised } : null,
      ]}
      className={[
        "flex-row items-center justify-center rounded-control",
        SIZE_CLASS[size],
        isPrimary ? "bg-primary" : "border border-control",
        fullWidth ? "w-full" : "",
        className,
      ].join(" ")}
    >
      <Text
        className={[
          isPrimary ? "text-primary-ink" : "text-text",
          size === "sm" ? "text-[13px]" : "text-[15px]",
          isPrimary ? "font-inter-semibold" : "font-inter-medium",
        ].join(" ")}
      >
        {label}
      </Text>
    </Pressable>
  );
}
