/**
 * FitForge — SetRow
 * apps/mobile/src/components/SetRow.tsx
 */

import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
} from "react-native";
import { useWorkoutStore } from "../store/workout";

type Props = {
  blockId: string;
  setId:   string;
  index:   number;       // 1-based
  prev:    string;       // e.g. "80 × 8"
  done:    boolean;
  defaultWeight: number;
  defaultReps:   number;
};

export function SetRow({
  blockId, setId, index, prev, done, defaultWeight, defaultReps,
}: Props) {
  const { updateSet, completeSet } = useWorkoutStore();

  const [weight, setWeight] = useState(String(defaultWeight || ""));
  const [reps,   setReps]   = useState(String(defaultReps   || ""));

  const handleComplete = () => {
    const w = parseFloat(weight);
    const r = parseInt(reps);
    if (!w || !r) return;           // don't complete empty sets
    updateSet(blockId, setId, w, r);
    completeSet(blockId, setId);
  };

  return (
    <View style={[styles.row, done && styles.rowDone]}>

      {/* Set number */}
      <Text style={[styles.num, done && styles.numDone]}>{index}</Text>

      {/* Previous performance */}
      <Text style={styles.prev}>{prev || "—"}</Text>

      {/* Weight input */}
      <TextInput
        style={[styles.input, done && styles.inputDone]}
        value={weight}
        onChangeText={setWeight}
        keyboardType="decimal-pad"
        editable={!done}
        selectTextOnFocus
        placeholder="0"
        placeholderTextColor={colors.muted2}
      />

      {/* Reps input */}
      <TextInput
        style={[styles.input, done && styles.inputDone]}
        value={reps}
        onChangeText={setReps}
        keyboardType="number-pad"
        editable={!done}
        selectTextOnFocus
        placeholder="0"
        placeholderTextColor={colors.muted2}
      />

      {/* Checkmark */}
      <Pressable
        style={[styles.check, done && styles.checkDone]}
        onPress={handleComplete}
        disabled={done}
      >
        <Text style={[styles.checkMark, done && styles.checkMarkDone]}>✓</Text>
      </Pressable>

    </View>
  );
}

const colors = {
  surface2: "#1E1E1E",
  border:   "#2A2A2A",
  accent:   "#4ADE80",
  text:     "#F2F2F2",
  muted:    "#666",
  muted2:   "#444",
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 5,
    paddingHorizontal: 6,
    borderRadius: 10,
  },
  rowDone: {
    backgroundColor: "#1a2e1f",
  },

  num: {
    width: 22,
    fontSize: 12,
    fontFamily: "DM-Mono",   // make sure this is loaded in app
    color: colors.muted,
    textAlign: "center",
  },
  numDone: {
    color: colors.accent,
  },

  prev: {
    flex: 1,
    fontSize: 11,
    color: colors.muted,
  },

  input: {
    width: 68,
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingVertical: 7,
    textAlign: "center",
    fontSize: 14,
    color: colors.text,
  },
  inputDone: {
    backgroundColor: "transparent",
    borderColor: "transparent",
    color: colors.accent,
  },

  check: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 2,
  },
  checkDone: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  checkMark: {
    fontSize: 14,
    color: colors.muted,
    fontWeight: "600",
  },
  checkMarkDone: {
    color: "#000",
  },
});
