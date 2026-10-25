# FitForge — Blueprint

Context file for humans and agents working in this repo. Describes what the app is,
how it's built, the conventions to follow, and what's still to come.

---

## 1. What this is

**FitForge** is a gym workout tracker built around a **rolling Push / Pull / Legs cycle
(with rest days)** instead of fixed calendar weekdays. Android-first, iOS later.

**Current stage:** the UI direction is settled and ported from `design/ui-demo.html`
("True-black flat"). Six screens are built and navigable: Welcome → Username →
Split Builder → the Today / Split / Progress / Profile tab shell, plus an Active
workout screen. A separate API layer (`src/core/api`) is scaffolded and runs on
**mock data**; there is **no persistence layer and no domain engine yet** (see §9).

---

## 2. Tech stack

| Concern | Choice |
| --- | --- |
| Framework | React Native 0.79.6 via **Expo SDK 53** (New Architecture) |
| Language | **TypeScript 5.8**, `strict: true` |
| Navigation | **expo-router 5** (file-based) |
| Styling | **NativeWind 4** (Tailwind 3.4 for RN) |
| Animation | react-native-reanimated 3 |
| Gestures | react-native-gesture-handler 2 |
| Drag & drop | **react-native-draggable-flatlist 4** (Split Builder) |
| Graphics | **react-native-svg 15** (brand mark + bar chart) |
| Fonts | **Inter** (`@expo-google-fonts/inter` — 400 / 500 / 600) |
| Icons | `@expo/vector-icons` (Feather) |
| React | 19.0.0 |

App identity (`app.json`): name `FitForge`, slug `fitforge`, scheme `fitforge`,
bundle/pkg `com.chetan.fitforge`, `userInterfaceStyle: "dark"`, background `#000000`.
The app is **dark-only**; the demo's light theme is not ported.

**Scripts:** `start`, `android`, `ios`, `prebuild`, `lint` (`expo lint` — needs an
ESLint config first), `typecheck` (`tsc --noEmit`).

> Note: `@expo-google-fonts/*` re-exports every weight from its package root, so
> importing from `"@expo-google-fonts/inter"` bundles all 18 TTFs. Importing the
> per-weight subpaths would trim several MB if bundle size matters later.

---

## 3. Directory structure

```
fit-forge/
├── app/                          # Expo Router routes — THIN, file name = URL
│   ├── _layout.tsx               # Root: Inter fonts, splash, providers, Stack
│   ├── index.tsx                 # "/" → re-exports WelcomeScreen
│   ├── onboarding/
│   │   ├── username.tsx          # "/onboarding/username" → UsernameScreen
│   │   └── split.tsx             # "/onboarding/split" → SplitBuilderScreen
│   ├── (tabs)/
│   │   ├── _layout.tsx           # Tabs host, uses the custom TabBar
│   │   ├── today.tsx             # "/today" → TodayScreen
│   │   ├── split.tsx             # "/split" → SplitViewScreen
│   │   ├── progress.tsx          # "/progress" → ProgressScreen
│   │   └── profile.tsx           # "/profile" → ProfileScreen
│   └── workout/
│       └── [exerciseId].tsx      # "/workout/:exerciseId" → ActiveWorkoutScreen
├── src/                          # Shared, non-route code (imported via "@/")
│   ├── design-system/            # Tokens + UI primitives
│   │   ├── theme.ts              # Color + font tokens (source of truth in TS)
│   │   ├── Button.tsx            # primary (white) / outline, sm + md, fullWidth
│   │   ├── Input.tsx             # text field, focus + valid states
│   │   ├── ProgressBar.tsx       # thin track + labelled ends (onboarding + sets)
│   │   ├── Card.tsx              # surface panel
│   │   ├── RowList.tsx           # RowList / Row / RowGrow / RowValue
│   │   ├── KpiStrip.tsx          # KpiStrip / Kpi
│   │   ├── CycleStrip.tsx        # the rolling-cycle pill strip
│   │   ├── Stepper.tsx           # weight / reps adjuster
│   │   ├── BarChart.tsx          # SVG bar chart (weekly volume)
│   │   ├── Mark.tsx              # SVG barbell brand mark
│   │   ├── ScreenHeader.tsx      # 48px app bar (left / title / right)
│   │   ├── IconButton.tsx        # round icon button
│   │   └── TabBar.tsx            # custom expo-router tab bar
│   ├── core/                     # Feature-agnostic kernel
│   │   ├── api/                  # THE ONLY place that talks to the backend
│   │   │   ├── client.ts         #   fetch wrapper (unused while mocks are on)
│   │   │   ├── types.ts          #   wire DTOs
│   │   │   ├── mocks.ts          #   in-memory seed data + mutable store
│   │   │   ├── endpoints/        #   profile / splits / workouts / history
│   │   │   └── index.ts          #   barrel
│   │   ├── config/env.ts         # API origin + USE_MOCKS switch
│   │   ├── domain/               # Pure TS: models + split engine (no RN imports)
│   │   │   └── username.ts
│   │   ├── data/                 # Drizzle schema + repositories (planned)
│   │   ├── lib/format.ts         # Pure formatters (dates, numbers, weight)
│   │   └── state/useAsyncData.ts # Minimal data hook (until TanStack Query)
│   └── features/                 # Vertical feature slices
│       ├── onboarding/           # Welcome + Username (+ components/)
│       ├── split-builder/        # Split Builder + Split view (+ components/)
│       ├── workout/              # Today + Active workout (+ components/)
│       ├── history/              # Progress & stats
│       └── profile/              # Profile tab
├── design/                       # UI direction demos (ui-demo.html = the chosen one)
├── global.css                    # Tailwind directives (NativeWind input)
├── tailwind.config.js            # NativeWind theme = design tokens
├── babel.config.js               # nativewind/babel + reanimated plugin (last)
├── metro.config.js               # withNativeWind(config, { input: "./global.css" })
├── nativewind-env.d.ts           # NativeWind TS types (enables `className`)
├── tsconfig.json                 # strict; "@/*" -> "./src/*"
└── app.json                      # Expo config
```

**Dependency direction:** `features → core → design-system`. Nothing in
`core/` may import from `features/`; nothing in `core/domain/` or `core/api/` may
import React or React Native. `app/` route files stay trivial — they only re-export a
screen from a feature; all screen logic lives under `src/features/`.

---

## 4. Routing & navigation

`"main": "expo-router/entry"`. A single root native `Stack` (`headerShown: false`,
background `#000000`, `slide_from_right`) hosts an onboarding flow, a tab group, and a
pushed workout screen.

| Route file | URL | Responsibility |
| --- | --- | --- |
| `app/_layout.tsx` | (root) | Loads **Inter** via `useFonts`; holds splash (`preventAutoHideAsync`) until fonts resolve; renders `GestureHandlerRootView` → `SafeAreaProvider` → `StatusBar` + `<Stack>`. Imports `global.css`. |
| `app/index.tsx` | `/` | Re-exports `WelcomeScreen`. Mark, headline, cycle preview, CTAs → `/onboarding/username`. |
| `app/onboarding/username.tsx` | `/onboarding/username` | Re-exports `UsernameScreen`. Progress bar (1 of 3), validation via `core/domain/username`, live preview, → `/onboarding/split`. |
| `app/onboarding/split.tsx` | `/onboarding/split` | Re-exports `SplitBuilderScreen`. Drag-to-reorder the cycle, save via the API layer, then `router.replace("/(tabs)/today")`. |
| `app/(tabs)/_layout.tsx` | — | `<Tabs>` with the custom `TabBar`; `sceneStyle` = `colors.bg`. |
| `app/(tabs)/today.tsx` | `/today` | `TodayScreen` — the core screen. |
| `app/(tabs)/split.tsx` | `/split` | `SplitViewScreen` — the saved split, read-only; "Edit" → `/onboarding/split`. |
| `app/(tabs)/progress.tsx` | `/progress` | `ProgressScreen` — volume chart + records. |
| `app/(tabs)/profile.tsx` | `/profile` | `ProfileScreen` — identity + static rows. |
| `app/workout/[exerciseId].tsx` | `/workout/:exerciseId` | `ActiveWorkoutScreen` — set logging. |

Route files are **thin**: each default-exports a screen from `src/features/` and holds
no logic. The screen component owns everything (state, styling, navigation).

**Navigation APIs in use:** `useRouter().push()` (string + object-with-params forms),
`router.replace()`, `router.back()`, `useLocalSearchParams()`, and `<Tabs>` with a
`tabBar` render prop.

---

## 5. Design system & styling

- **NativeWind utility classes** (`className`) are the default for layout/styling.
- Use the TS `colors` / `fonts` from `src/design-system/theme.ts` only where a class
  can't go: icon `color`, `StatusBar`, Reanimated `style`, SVG props,
  `placeholderTextColor`, inline `flex`/`aspectRatio` styles on third-party components.
- Tokens live in **two mirrored places**: `tailwind.config.js` (class generation) and
  `src/design-system/theme.ts` (raw values). Keep them in sync when adding a token.
- Fonts are named distinctly (`sans`, `inter-medium`, `inter-semibold`) so they never
  collide with Tailwind font-weight utilities. There is no 700 weight loaded.
- The direction is **single-hue**: elevation comes from lightness alone and the lime
  accent appears **only** on data marks and active state. The one filled CTA is
  **white**, not the accent. Dark theme throughout (`bg #000000`, status bar light).

**Token palette**

| Group | Values |
| --- | --- |
| Surfaces | `bg #000000`, `surface #111111`, `raised #2A2A2A`, `active #222222`, `border #1A1A1A`, `rule #161616`, `control #444444` |
| Text | `text #FFFFFF`, `muted #B4B4B4`, `faint #949494` |
| Accent (lime) | `accent #C6F24E`, `accent-ink #000000` — data marks / active state only |
| CTA | `primary #FFFFFF`, `primary-ink #000000` |
| Semantic | `positive #C6F24E`, `negative #E5484D`, `warning #E5A93B` |
| Chart / chrome | `grid #2B2B2B`, `tab-idle #BBBBBB` |
| Legacy | `push/pull/legs` (+ tints), `warn-*` — from the earlier multi-colour direction, **unused** |
| Radii | `card 20px`, `control 999px` (plus `xl 14`, `2xl 16`, `3xl 20`, `4xl 24`) |

`theme.ts` also exports `CategoryType` and `categoryColor`.

---

## 6. Components

| File | API / notes |
| --- | --- |
| `Button.tsx` | `{ label, onPress?, variant? ("primary"\|"outline"), size? ("sm"\|"md"), fullWidth?, disabled?, className? }`. Primary = white fill, black semibold label; press nudges down 1px; disabled → 0.4 opacity. |
| `Input.tsx` | Thin wrapper over RN `TextInput` (spreads `TextInputProps`) + `valid?: boolean` → shows an accent check. Focus turns the border accent. |
| `ProgressBar.tsx` | `{ progress (0–1), left?, right?, className? }` — accent track with labelled ends; used for onboarding progress and set progress. |
| `Card.tsx` | `{ children, className? }` — surface panel. |
| `RowList.tsx` | `RowList` (container; 1px gaps expose `rule`, so no per-row borders), `Row`, `RowGrow { title, subtitle? }`, `RowValue { value, tone? ("default"\|"accent"\|"muted") }`. |
| `KpiStrip.tsx` | `KpiStrip` (equal columns, hairline dividers) + `Kpi { label, value, suffix?, tone? }`. |
| `CycleStrip.tsx` | `{ days: CycleDay[], todayIndex?, className? }` — the signature element; today is the only accent fill. |
| `Stepper.tsx` | `{ label, value, onDecrement?, onIncrement? }` — −/+ around a tabular value. |
| `BarChart.tsx` | `{ data: { label, value }[], className? }` — SVG bars over a labelled baseline; axis max snaps to a nice multiple of 3 so the thirds label cleanly. |
| `Mark.tsx` | `{ size?, color? }` — the barbell brand glyph (SVG). |
| `ScreenHeader.tsx` | `{ left?, title?, right?, className? }` — 48px app bar, no rule. |
| `IconButton.tsx` | `{ icon, accessibilityLabel, onPress?, size?, className? }` — round, quiet. |
| `TabBar.tsx` | Custom `tabBar` for `<Tabs>`; text-only labels, active = white semibold. |

No barrel/index file — import primitives by explicit path (`@/design-system/Button`).

---

## 7. Conventions

- **Path alias:** `@/*` → `./src/*` (tsconfig `baseUrl: "."` + `paths`). Routes never
  import each other directly; shared code always via `@/`. Reach any layer as
  `@/design-system/...`, `@/core/...`, `@/features/...`.
- **No inline data fetching.** Screens never call `fetch`; they call an endpoint from
  `@/core/api` through `useAsyncData` and render the result. All backend knowledge
  lives in `src/core/api`.
- **Naming:** components `PascalCase.tsx`; route files `lowercase.tsx` matching the URL
  (thin re-exports); exported screens named by role (`WelcomeScreen`, `TodayScreen`)
  and live in `src/features/<feature>/screens/`; UI primitives use named exports; types
  `PascalCase` (`ButtonProps`); constants `UPPER_SNAKE_CASE` (`DEFAULT_CYCLE`, `NICE_STEPS`).
- **Import order:** third-party first, blank line, then `@/` local imports.
- **Organization:** one component per file, co-located prop types above the component.
- **Styling:** `className` first; TS tokens only for non-class APIs.

---

## 8. Key domain logic (present so far)

- **Username rules** live in the pure domain module `src/core/domain/username.ts`:
  `USERNAME_RE`, `USERNAME_MIN_LENGTH` / `USERNAME_MAX_LENGTH`, `sanitizeUsername()`,
  `isValidUsername()`. Consumed by `UsernameScreen`; the module has no RN imports.
- **Formatters** live in `src/core/lib/format.ts`: `formatIsoDate`, `formatThousands`,
  `formatRepRange`, `formatWeight`, `formatSignedPercent` — pure, reused across screens.

The **split engine** (today's workout / missed day / streak) is not implemented.

---

## 9. Roadmap / planned layers

1. ~~**Split Builder (Screen 3)**~~ — done: `src/features/split-builder/` reorders and
   saves the cycle. Remaining: editing individual exercises (add/remove/sets/reps).
2. **`src/core/domain/`** — models + the pure-TypeScript split engine (rolling cycle,
   today's workout, missed days, streaks) — no UI/IO dependencies. Username rules and
   formatters already live in `core/`; the engine currently lives only in the mocks.
3. **`src/core/data/`** — Expo SQLite + Drizzle ORM schema and repositories
   (offline-first).
4. **`src/core/state/`** — Zustand (+ TanStack Query) for app state and data fetching,
   replacing `useAsyncData`.
5. **`src/core/api/`** — point `expo.extra.apiBaseUrl` (see `src/core/config/env.ts`)
   at the **Rust server** and flip `USE_MOCKS` off; the endpoint signatures already
   match the intended REST surface.
6. **Accounts / sign-in** — the "I already have an account" CTA and the Profile tab's
   "Sign out" are TODO stubs.

Installed-but-unused: `expo-haptics` (tactile feedback), `expo-constants`,
`expo-linking`. Not yet installed: Zustand, TanStack Query, expo-sqlite, drizzle-orm.

---

## 10. Adding a new screen (checklist)

1. Add the screen component at
   `src/features/<feature>/screens/<Name>Screen.tsx` (named export, `PascalCase` file).
2. Create the route `app/<segment>/<name>.tsx` (file name = URL) that
   `export { <Name>Screen as default } from "@/features/<feature>/screens/<Name>Screen";`.
   Tab screens go under `app/(tabs)/` and need a `<Tabs.Screen>` entry in
   `app/(tabs)/_layout.tsx` plus a label in `TabBar.tsx`.
3. Wrap content in `<SafeAreaView edges={["top"]} className="flex-1 bg-bg">` (`top`
   only for tab screens — the tab bar owns the bottom inset).
4. Use `Animated.View` with `FadeInDown`/`FadeIn` for entrance, matching existing delays.
5. Style with NativeWind classes; pull raw tokens from `@/design-system/theme`. Prefer
   the primitives in `src/design-system/` over re-styling raw `View`/`Text`.
6. Load data with `useAsyncData(endpoint, deps)` from `@/core/state/useAsyncData` —
   never fetch inline.
7. Navigate with `useRouter().push({ pathname, params })`; read with `useLocalSearchParams`.
8. Run `npm run typecheck` before finishing (`npm run lint` needs ESLint set up first).
