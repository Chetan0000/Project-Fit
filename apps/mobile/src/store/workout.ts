
//   bun add zustand immer react-native-mmkv uuid
 
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { MMKV } from "react-native-mmkv";
import { v4 as uuid } from "uuid";

// ── Storage ──────────────────────────────────

const mmkv = new MMKV({ id: "fitforge" });
const storage = createJSONStorage(() => ({
  getItem:    (k: string) => mmkv.getString(k) ?? null,
  setItem:    (k: string, v: string) => mmkv.set(k, v),
  removeItem: (k: string) => mmkv.delete(k),
}));

// ── Types ────────────────────────────────────

export type SetEntry = {
  id: string;
  weight: number;
  reps: number;
  done: boolean;
};

export type ExerciseBlock = {
  id: string;
  name: string;
  sets: SetEntry[];
};

export type Session = {
  id: string;
  startedAt: number;
  endedAt: number | null;
  exercises: ExerciseBlock[];
};

// ── Store ────────────────────────────────────

type Store = {
  session: Session | null;

  startSession:   () => void;
  endSession:     () => void;
  discardSession: () => void;

  addExercise: (name: string) => void;

  addSet:      (blockId: string) => void;
  updateSet:   (blockId: string, setId: string, weight: number, reps: number) => void;
  completeSet: (blockId: string, setId: string) => void;
  removeSet:   (blockId: string, setId: string) => void;
};

export const useWorkoutStore = create<Store>()(
  persist(
    immer((set) => ({
      session: null,

      startSession: () =>
        set((s) => {
          s.session = { id: uuid(), startedAt: Date.now(), endedAt: null, exercises: [] };
        }),

      endSession: () =>
        set((s) => {
          if (s.session) s.session.endedAt = Date.now();
        }),

      discardSession: () =>
        set((s) => { s.session = null; }),

      addExercise: (name) =>
        set((s) => {
          s.session?.exercises.push({ id: uuid(), name, sets: [] });
        }),

      addSet: (blockId) =>
        set((s) => {
          const block = s.session?.exercises.find((e:SetEntry) => e.id === blockId);
          block?.sets.push({ id: uuid(), weight: 0, reps: 0, done: false });
        }),

      updateSet: (blockId, setId, weight, reps) =>
        set((s) => {
          const block = s.session?.exercises.find((e:SetEntry) => e.id === blockId);
          const entry = block?.sets.find((x:SetEntry) => x.id === setId);
          if (entry) { entry.weight = weight; entry.reps = reps; }
        }),

      completeSet: (blockId, setId) =>
        set((s) => {
          const block = s.session?.exercises.find((e:any) => e.id === blockId);
          const entry = block?.sets.find((x:any) => x.id === setId);
          if (entry) entry.done = true;
        }),

      removeSet: (blockId, setId) =>
        set((s) => {
          const block = s.session?.exercises.find((e:any) => e.id === blockId);
          if (block) block.sets = block.sets.filter((x:any) => x.id !== setId);
        }),
    })),
    { name: "fitforge-session", storage }
  )
);