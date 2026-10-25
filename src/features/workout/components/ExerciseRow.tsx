import type { ExerciseProgress } from "@/core/api/types";
import { Row, RowGrow, RowValue } from "@/design-system/RowList";
import { formatRepRange, formatWeight } from "@/core/lib/format";

type ExerciseRowProps = {
  progress: ExerciseProgress;
};

/** One exercise on the Today list: prescription and logged set count. */
export function ExerciseRow({ progress }: ExerciseRowProps) {
  const { exercise, sets } = progress;
  const done = sets.filter((set) => set.done).length;
  const total = sets.length;
  const tone = done > 0 && done === total ? "accent" : done > 0 ? "default" : "muted";

  return (
    <Row>
      <RowGrow
        title={exercise.name}
        subtitle={`${exercise.sets} × ${formatRepRange(exercise.repMin, exercise.repMax)} · ${formatWeight(exercise.targetWeightKg)}`}
      />
      <RowValue value={`${done}/${total}`} tone={tone} />
    </Row>
  );
}
