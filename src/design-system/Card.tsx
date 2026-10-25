import type { ReactNode } from "react";
import { View } from "react-native";

type CardProps = {
  children: ReactNode;
  className?: string;
};

/** Surface panel: the direction's `.panel`. */
export function Card({ children, className = "" }: CardProps) {
  return (
    <View className={["rounded-card bg-surface p-4", className].join(" ")}>
      {children}
    </View>
  );
}
