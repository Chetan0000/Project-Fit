import type {
  CategoryType,
  Exercise,
  ExerciseProgress,
  PersonalRecord,
  Profile,
  ProgressOverview,
  SetLog,
  SplitDay,
  WeeklyVolume,
  WorkoutSession,
} from "@/core/api/types";

/** Deep copy so callers can never mutate the seed data. */
export function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function makeExercise(
  id: string,
  name: string,
  sets: number,
  repMin: number,
  repMax: number,
  targetWeightKg: number,
): Exercise {
  return { id, name, sets, repMin, repMax, targetWeightKg };
}

function trainingDay(
  id: string,
  name: string,
  category: CategoryType,
  exercises: Exercise[],
): SplitDay {
  return { id, name, category, exercises };
}

function restDay(id: string): SplitDay {
  return { id, name: "Rest", category: "rest", exercises: [] };
}

const SEED_SPLIT: SplitDay[] = [
  trainingDay("push-a", "Push A", "push", [
    makeExercise("push-a-bench", "Bench Press", 4, 6, 8, 70),
    makeExercise("push-a-ohp", "Overhead Press", 3, 8, 8, 40),
    makeExercise("push-a-incline", "Incline DB Press", 3, 10, 10, 24),
    makeExercise("push-a-lateral", "Lateral Raise", 3, 15, 15, 10),
    makeExercise("push-a-pushdown", "Triceps Pushdown", 3, 12, 12, 25),
  ]),
  trainingDay("pull-a", "Pull A", "pull", [
    makeExercise("pull-a-deadlift", "Deadlift", 3, 5, 5, 120),
    makeExercise("pull-a-row", "Barbell Row", 4, 8, 8, 60),
    makeExercise("pull-a-pulldown", "Lat Pulldown", 3, 10, 10, 55),
    makeExercise("pull-a-curl", "Barbell Curl", 3, 12, 12, 30),
    makeExercise("pull-a-facepull", "Face Pull", 3, 15, 15, 20),
  ]),
  trainingDay("legs-a", "Legs A", "legs", [
    makeExercise("legs-a-squat", "Back Squat", 4, 6, 8, 90),
    makeExercise("legs-a-rdl", "Romanian Deadlift", 3, 8, 8, 80),
    makeExercise("legs-a-press", "Leg Press", 3, 10, 10, 140),
    makeExercise("legs-a-calf", "Standing Calf Raise", 4, 12, 12, 60),
    makeExercise("legs-a-hlr", "Hanging Leg Raise", 3, 12, 12, 0),
  ]),
  restDay("rest-1"),
  trainingDay("push-b", "Push B", "push", [
    makeExercise("push-b-incline", "Incline Bench Press", 4, 8, 8, 60),
    makeExercise("push-b-dbpress", "DB Shoulder Press", 3, 10, 10, 22),
    makeExercise("push-b-fly", "Cable Fly", 3, 12, 12, 15),
    makeExercise("push-b-lateral", "Lateral Raise", 3, 15, 15, 10),
    makeExercise("push-b-dips", "Dips", 3, 8, 8, 0),
  ]),
  trainingDay("pull-b", "Pull B", "pull", [
    makeExercise("pull-b-pullup", "Pull-up", 4, 6, 6, 0),
    makeExercise("pull-b-row", "Seated Row", 3, 10, 10, 55),
    makeExercise("pull-b-shrug", "Barbell Shrug", 3, 12, 12, 70),
    makeExercise("pull-b-hammer", "Hammer Curl", 3, 12, 12, 14),
    makeExercise("pull-b-reardelt", "Rear Delt Fly", 3, 15, 15, 8),
  ]),
  trainingDay("legs-b", "Legs B", "legs", [
    makeExercise("legs-b-frontsquat", "Front Squat", 4, 8, 8, 70),
    makeExercise("legs-b-hipthrust", "Barbell Hip Thrust", 3, 10, 10, 100),
    makeExercise("legs-b-legcurl", "Lying Leg Curl", 3, 12, 12, 45),
    makeExercise("legs-b-calf", "Seated Calf Raise", 4, 15, 15, 40),
    makeExercise("legs-b-crunch", "Cable Crunch", 3, 15, 15, 30),
  ]),
  restDay("rest-2"),
];

/**
 * In-memory stand-in for the Rust API. Mutations (saving a split, logging a set)
 * persist for the session only — replaced once the server and the data layer land.
 */
export const mockStore = {
  profile: {
    id: "u_1",
    username: "chetan",
    memberSince: "2026-10-21",
  } as Profile,
  splitDays: clone(SEED_SPLIT),
  /** The cycle is on Legs A (index 2), i.e. session 3 of 8. */
  todayIndex: 2,
  streakSessions: 9,
  /** Sets already completed today, keyed by exercise id. */
  doneToday: {
    "legs-a-squat": 4,
    "legs-a-rdl": 3,
    "legs-a-press": 1,
  } as Record<string, number>,
  records: [
    { id: "pr-bench", exercise: "Bench Press", weightKg: 80, achievedOn: "2026-10-14" },
    { id: "pr-squat", exercise: "Back Squat", weightKg: 110, achievedOn: "2026-09-30" },
    { id: "pr-deadlift", exercise: "Deadlift", weightKg: 140, achievedOn: "2026-09-23" },
  ] as PersonalRecord[],
  weeklyVolume: [
    { label: "09-02", volumeKg: 9700 },
    { label: "09-09", volumeKg: 10800 },
    { label: "09-16", volumeKg: 10400 },
    { label: "09-23", volumeKg: 11500 },
    { label: "09-30", volumeKg: 11100 },
    { label: "10-07", volumeKg: 12000 },
    { label: "10-14", volumeKg: 11500 },
  ] as WeeklyVolume[],
  summary: {
    weekSessions: 3,
    weekTarget: 5,
    streakSessions: 9,
    recordsThisCycle: 3,
  },
};

export function buildExerciseProgress(exercise: Exercise): ExerciseProgress {
  const done = mockStore.doneToday[exercise.id] ?? 0;
  const sets: SetLog[] = Array.from({ length: exercise.sets }, (_, i) => ({
    index: i + 1,
    weightKg: exercise.targetWeightKg,
    reps: exercise.repMax,
    done: i < done,
  }));
  return { exercise: clone(exercise), sets };
}

export function buildTodaySession(): WorkoutSession {
  const day = mockStore.splitDays[mockStore.todayIndex];
  if (!day) throw new Error("Mock split has no day at todayIndex");

  const exercises = day.exercises.map(buildExerciseProgress);
  const setsLogged = exercises.reduce(
    (n, e) => n + e.sets.filter((s) => s.done).length,
    0,
  );
  const setsPlanned = exercises.reduce((n, e) => n + e.sets.length, 0);
  const volumeKg = exercises.reduce(
    (total, e) =>
      total + e.sets.filter((s) => s.done).reduce((v, s) => v + s.weightKg * s.reps, 0),
    0,
  );

  return {
    id: "session-today",
    dayId: day.id,
    dayName: day.name,
    sessionNumber: mockStore.todayIndex + 1,
    cycleLength: mockStore.splitDays.length,
    setsLogged,
    setsPlanned,
    volumeKg,
    streakSessions: mockStore.streakSessions,
    cycle: mockStore.splitDays.map((d) => ({
      label: d.name,
      rest: d.category === "rest",
    })),
    exercises,
  };
}

export function buildProgressOverview(): ProgressOverview {
  return clone({
    weeklyVolume: mockStore.weeklyVolume,
    records: mockStore.records,
    summary: mockStore.summary,
  });
}
