import { Text } from "react-native";
import { Feather } from "@expo/vector-icons";

import { Row } from "@/design-system/RowList";
import { colors } from "@/design-system/theme";
import type { SetLog } from "@/core/api/types";

type SetRowProps = {
  log: SetLog;
};

/** One logged (or pending) set: index, weight × reps, and a tick when done. */
export function SetRow({ log }: SetRowProps) {
  return (
    <Row>
      <Text
        className="w-4 font-sans text-xs text-faint"
        style={{ fontVariant: ["tabular-nums"] }}
      >
        {log.index}
      </Text>
      <Text
        className="flex-1 font-inter-medium text-[15px] text-text"
        style={{ fontVariant: ["tabular-nums"] }}
      >
        {log.weightKg > 0 ? `${log.weightKg.toFixed(1)} kg` : "BW"}
        <Text className="font-sans text-[13px] text-muted"> × {log.reps}</Text>
      </Text>
      {log.done ? <Feather name="check" size={15} color={colors.accent} /> : null}
    </Row>
  );
}
