/**
 * Domain types for the FitForge API. These are the wire shapes the (future)
 * Rust server will return, and what the mock endpoints below already speak.
 *
 * Deliberately independent of the design system — this layer must not depend
 * on UI tokens.
 */

/** The three training categories plus rest days. */
export type CategoryType = "push" | "pull" | "legs" | "rest";

export type Profile = {
  id: string;
  username: string;
  /** ISO date (yyyy-mm-dd). */
  memberSince: string;
};

export type Exercise = {
  id: string;
  name: string;
  sets: number;
  repMin: number;
  repMax: number;
  /** Target working weight in kg (0 for bodyweight movements). */
  targetWeightKg: number;
};

export type SplitDay = {
  id: string;
  name: string;
  category: CategoryType;
  exercises: Exercise[];
};

export type SetLog = {
  index: number;
  weightKg: number;
  reps: number;
  done: boolean;
};

export type ExerciseProgress = {
  exercise: Exercise;
  sets: SetLog[];
};

export type CycleDay = {
  label: string;
  rest: boolean;
};

export type WorkoutSession = {
  id: string;
  dayId: string;
  dayName: string;
  /** 1-based position in the rolling cycle. */
  sessionNumber: number;
  cycleLength: number;
  setsLogged: number;
  setsPlanned: number;
  volumeKg: number;
  streakSessions: number;
  /** Every day of the rolling cycle, in order. */
  cycle: CycleDay[];
  exercises: ExerciseProgress[];
};

export type PersonalRecord = {
  id: string;
  exercise: string;
  weightKg: number;
  /** ISO date (yyyy-mm-dd). */
  achievedOn: string;
};

export type WeeklyVolume = {
  /** Week label, e.g. "09-02". */
  label: string;
  volumeKg: number;
};

export type TrainingSummary = {
  weekSessions: number;
  weekTarget: number;
  streakSessions: number;
  recordsThisCycle: number;
};

/** Everything the Progress screen renders, in one payload. */
export type ProgressOverview = {
  weeklyVolume: WeeklyVolume[];
  records: PersonalRecord[];
  summary: TrainingSummary;
};
