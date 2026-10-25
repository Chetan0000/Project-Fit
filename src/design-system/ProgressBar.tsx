import { View, Text } from "react-native";

type ProgressBarProps = {
  /** Filled ratio, 0–1. */
  progress: number;
  /** Left-aligned caption under the track. */
  left?: string;
  /** Right-aligned caption under the track (rendered with tabular figures). */
  right?: string;
  className?: string;
};

/**
 * The direction replaces onboarding step dots with a real progress ratio:
 * a thin accent-filled track with both ends labelled.
 */
export function ProgressBar({ progress, left, right, className = "" }: ProgressBarProps) {
  const pct = Math.max(0, Math.min(1, progress)) * 100;

  return (
    <View className={["gap-[7px]", className].join(" ")}>
      <View className="h-[4px] overflow-hidden rounded-control bg-raised">
        <View className="h-full rounded-control bg-accent" style={{ width: `${pct}%` }} />
      </View>
      {left || right ? (
        <View className="flex-row justify-between">
          <Text className="font-sans text-xs text-muted">{left}</Text>
          <Text
            className="font-sans text-xs text-muted"
            style={{ fontVariant: ["tabular-nums"] }}
          >
            {right}
          </Text>
        </View>
      ) : null}
    </View>
  );
}
