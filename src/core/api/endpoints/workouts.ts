import { request } from "@/core/api/client";
import { buildExerciseProgress, buildTodaySession, clone, mockStore } from "@/core/api/mocks";
import type { ExerciseProgress, WorkoutSession } from "@/core/api/types";
import { USE_MOCKS } from "@/core/config/env";

export type LogSetInput = {
  exerciseId: string;
  weightKg: number;
  reps: number;
};

export async function getToday(): Promise<WorkoutSession> {
  if (!USE_MOCKS) return request<WorkoutSession>("/workouts/today");
  return buildTodaySession();
}

export async function getExerciseProgress(
  exerciseId: string,
): Promise<ExerciseProgress | null> {
  if (!USE_MOCKS) return request<ExerciseProgress>(`/workouts/exercises/${exerciseId}`);
  const session = buildTodaySession();
  return session.exercises.find((e) => e.exercise.id === exerciseId) ?? null;
}

/** Marks the next unlogged set of an exercise as done. */
export async function logSet(input: LogSetInput): Promise<ExerciseProgress | null> {
  if (!USE_MOCKS) {
    return request<ExerciseProgress>("/workouts/sets", { method: "POST", body: input });
  }

  const day = mockStore.splitDays[mockStore.todayIndex];
  const exercise = day?.exercises.find((e) => e.id === input.exerciseId);
  if (!exercise) return null;

  const done = mockStore.doneToday[exercise.id] ?? 0;
  mockStore.doneToday = { ...mockStore.doneToday, [exercise.id]: Math.min(done + 1, exercise.sets) };
  return clone(buildExerciseProgress(exercise));
}
