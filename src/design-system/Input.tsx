import { useState } from "react";
import { View, TextInput, type TextInputProps } from "react-native";
import { Feather } from "@expo/vector-icons";

import { colors } from "@/design-system/theme";

type InputProps = TextInputProps & {
  /** When true, shows the accent check mark on the right (valid state). */
  valid?: boolean;
};

/**
 * The direction's text field: dark surface, control border, accent border on
 * focus, and an optional trailing accent check when the value is valid.
 */
export function Input({ valid = false, onFocus, onBlur, style, ...rest }: InputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View className="relative w-full">
      <TextInput
        placeholderTextColor={colors.faint}
        selectionColor={colors.accent}
        autoCapitalize="none"
        autoCorrect={false}
        {...rest}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        className="h-[46px] w-full rounded-card bg-surface px-[14px] font-sans text-[15px] text-text"
        style={[
          { borderWidth: 1, borderColor: focused ? colors.accent : colors.control },
          style,
        ]}
      />
      {valid ? (
        <View className="absolute bottom-0 right-[14px] top-0 justify-center">
          <Feather name="check" size={18} color={colors.accent} />
        </View>
      ) : null}
    </View>
  );
}
