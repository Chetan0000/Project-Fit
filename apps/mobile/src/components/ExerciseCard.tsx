/**
 * FitForge — ExerciseCard
 * apps/mobile/src/components/ExerciseCard.tsx
 */

import { View, Text, Pressable, StyleSheet } from "react-native";
import { SetRow } from "./SetRow";
import { useWorkoutStore } from "../store/workout";
import type { ExerciseBlock } from "../store/workout";

type Props = {
  block: ExerciseBlock;
};

export function ExerciseCard({ block }: Props) {
  const { addSet } = useWorkoutStore();

  const volume = block.sets
    .filter((s) => s.done)
    .reduce((sum, s) => sum + s.weight * s.reps, 0);

  return (
    <View style={styles.card}>

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.name}>{block.name}</Text>
          <View style={styles.tag}>
            {/* <Text style={styles.tagText}>{block.muscleGroup.toUpperCase()}</Text> */}
            <Text style={styles.tagText}>{"Chest"}</Text>
          </View>
        </View>
        {volume > 0 && (
          <View style={styles.volBadge}>
            <Text style={styles.volText}>{volume} kg</Text>
          </View>
        )}
      </View>

      {/* Column headers */}
      <View style={styles.colHeader}>
        <Text style={[styles.colLabel, { width: 22 }]}>#</Text>
        <Text style={[styles.colLabel, { flex: 1 }]}>PREV</Text>
        <Text style={[styles.colLabel, { width: 68, textAlign: "center" }]}>KG</Text>
        <Text style={[styles.colLabel, { width: 68, textAlign: "center" }]}>REPS</Text>
        <Text style={[styles.colLabel, { width: 34 }]}></Text>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Sets */}
      {block.sets.map((s, i) => (
        <SetRow
          key={s.id}
          blockId={block.id}
          setId={s.id}
          index={i + 1}
          prev={s.weight && s.reps ? `${s.weight} × ${s.reps}` : ""}
          done={s.done}
          defaultWeight={s.weight}
          defaultReps={s.reps}
        />
      ))}

      {/* Add Set */}
      <Pressable style={styles.addSet} onPress={() => addSet(block.id)}>
        <Text style={styles.addSetText}>+ Add Set</Text>
      </Pressable>

    </View>
  );
}

const colors = {
  surface:  "#161616",
  surface2: "#1E1E1E",
  border:   "#2A2A2A",
  accent:   "#4ADE80",
  blue:     "#60A5FA",
  text:     "#F2F2F2",
  muted:    "#666",
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
    overflow: "hidden",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    paddingBottom: 10,
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  tag: {
    backgroundColor: colors.surface2,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: "flex-start",
  },
  tagText: {
    fontSize: 10,
    fontWeight: "500",
    color: colors.muted,
    letterSpacing: 0.6,
  },
  volBadge: {
    backgroundColor: colors.surface2,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  volText: {
    fontSize: 11,
    fontWeight: "500",
    color: colors.blue,
  },

  colHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 6,
    paddingBottom: 8,
  },
  colLabel: {
    fontSize: 10,
    fontWeight: "500",
    color: colors.muted,
    letterSpacing: 0.7,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: 16,
    marginBottom: 6,
  },

  addSet: {
    padding: 14,
    paddingTop: 10,
  },
  addSetText: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.muted,
  },
});
