# FitForge

A gym workout tracker built around a **rolling split cycle** (Push / Pull / Legs A & B with rest days) rather than fixed calendar weekdays. Android first, iOS later.

> **Status:** The UI direction is settled — ported from `design/ui-demo.html` ("True-black flat"). Six screens are built: Welcome → Username → Split Builder → the Today / Split / Progress / Profile tab shell, plus an Active workout screen. The API layer is scaffolded and runs on mock data.

---

## Tech stack

| Concern | Choice |
| --- | --- |
| Framework | React Native (New Architecture) via **Expo SDK 53** |
| Language | TypeScript (strict) |
| Navigation | Expo Router (file-based) |
| Styling | NativeWind (Tailwind for RN) |
| Animation | Reanimated 3 |
| Gestures | Gesture Handler |
| Drag & drop | react-native-draggable-flatlist (Split Builder) |
| Graphics | react-native-svg (brand mark + bar chart) |
| Fonts | **Inter** (`@expo-google-fonts/inter`) |
| Icons | `@expo/vector-icons` (Feather) |

Planned for upcoming steps: **Expo SQLite + Drizzle ORM** (offline-first data), **TanStack Query** + **Zustand** (state), and a pure-TypeScript **split engine** for the "today's workout / missed day / streak" logic.

---

## Prerequisites

- **Node.js 18+** (LTS recommended)
- The **Expo Go** app on your Android phone (from the Play Store) — easiest way to run it. Everything used so far (Reanimated, Gesture Handler, SQLite) is supported in Expo Go, so no custom native build is needed yet.
- *(Optional)* Android Studio + an emulator if you prefer running on a virtual device.

## Setup & run

```bash
cd fitforge

# 1. Install dependencies
npm install

# 2. Align native package versions to the installed Expo SDK (safety net)
npx expo install --fix

# 3. Start the dev server
npx expo start
```

Then either:
- **Phone:** open Expo Go and scan the QR code in the terminal, or
- **Emulator:** press `a` in the terminal to launch on Android.

If styling or animations ever look off after adding packages, restart with a clean cache:

```bash
npx expo start -c
```

## Project structure

```
fitforge/
├── app/                          # Expo Router routes — thin (file = URL)
│   ├── _layout.tsx               # Root: Inter fonts, splash, SafeArea, GestureHandler
│   ├── index.tsx                 # "/" → re-exports WelcomeScreen
│   ├── onboarding/
│   │   ├── username.tsx          # "/onboarding/username" → UsernameScreen
│   │   └── split.tsx             # "/onboarding/split" → SplitBuilderScreen
│   ├── (tabs)/                   # Today / Split / Progress / Profile + custom TabBar
│   └── workout/[exerciseId].tsx  # Active workout
├── src/
│   ├── design-system/            # Tokens + UI primitives
│   │   ├── theme.ts              # Colour + font tokens (from the demo)
│   │   ├── Button.tsx            # Primary (white) / outline
│   │   ├── Input.tsx             # Text field with validation check
│   │   ├── ProgressBar.tsx       # Track + labelled ends
│   │   ├── CycleStrip.tsx        # The rolling-cycle pill strip
│   │   ├── RowList.tsx           # RowList / Row / RowGrow / RowValue
│   │   ├── KpiStrip.tsx          # KpiStrip / Kpi
│   │   ├── BarChart.tsx          # SVG volume chart
│   │   ├── Mark.tsx              # SVG brand mark
│   │   └── …                     # Card, Stepper, ScreenHeader, IconButton, TabBar
│   ├── core/                     # Feature-agnostic kernel
│   │   ├── api/                  # The only layer that talks to the backend
│   │   │   ├── client.ts / types.ts / mocks.ts
│   │   │   └── endpoints/        # profile / splits / workouts / history
│   │   ├── config/env.ts         # API origin + USE_MOCKS switch
│   │   ├── domain/               # Pure TS models (username rules now)
│   │   ├── lib/format.ts         # Pure formatters
│   │   ├── data/                 # Drizzle schema + repositories (planned)
│   │   └── state/                # useAsyncData now; Zustand + Query planned
│   └── features/                 # Vertical feature slices
│       ├── onboarding/           # Welcome + Username
│       ├── split-builder/        # Split Builder + read-only Split view
│       ├── workout/              # Today + Active workout
│       ├── history/              # Progress & stats
│       └── profile/              # Profile tab
├── design/                       # UI direction demos (ui-demo.html = the chosen one)
├── tailwind.config.js            # NativeWind theme (demo design tokens)
├── babel.config.js               # NativeWind + Reanimated plugins
├── metro.config.js               # NativeWind Metro integration
└── global.css                    # Tailwind directives
```

Coming next: the split engine in `src/core/domain/`, offline data in `src/core/data/` (Expo SQLite + Drizzle), and state in `src/core/state/`. The API layer already isolates the backend — point `expo.extra.apiBaseUrl` at the Rust server and flip `USE_MOCKS` off when it exists.

## Notes on the Expo SDK version

This project is pinned to **Expo SDK 53** — a known-consistent dependency matrix so `npm install` works cleanly today. To move to the latest SDK later:

```bash
npm install expo@latest
npx expo install --fix
npx expo-doctor        # checks everything lines up
```

The app code (screens, components, TypeScript) is version-agnostic and will carry over unchanged.

## Path alias

`@/` maps to `src/` (configured in `tsconfig.json`, resolved automatically by Expo). Import shared code by its layer, e.g. `import { Button } from "@/design-system/Button"` or `import { isValidUsername } from "@/core/domain/username"`.
