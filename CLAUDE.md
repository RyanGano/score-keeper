# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager is **yarn** (yarn.lock is committed). Create React App (react-scripts 5) toolchain.

- `yarn start` — dev server at localhost:3000
- `yarn build` — production build into `build/` (this is what Azure Static Web Apps deploys)
- `yarn test` — Jest in watch mode via react-scripts
- `yarn test --watchAll=false -t "name of test"` — run a single test non-interactively
- `yarn major` / `yarn minor` / `yarn patch` — bumps the version in `package.json` **and** regenerates `src/version.ts` (via `yarn store-version` → genversion). Never hand-edit `src/version.ts`; the version string is rendered in the app's nav menu.

There is no lint script; ESLint runs through react-scripts (`eslintConfig` in package.json extends `react-app`). Type checking happens as part of `start`/`build` — tsconfig is `strict` with `noEmit`.

`src/__tests__/` exists but is currently empty — there are no tests in the repo yet.

## Deployment

`.github/workflows/build-main.yml` builds and deploys to Azure Static Web Apps on push to `main` and on PRs (PR previews; closing a PR tears down its environment). Staging/production URLs are in [README.md](README.md).

## Architecture

Single-page React app, no router. No backend — everything is client-side state.

**Game selection lives in [src/App.tsx](src/App.tsx).** Adding a game means: add a member to the `Game` enum, add a `<Button>` in the Offcanvas menu that calls `setActiveGame`, and render the game component conditionally at the bottom. `first-hand-last-hand` is fully written but *commented out* in App.tsx in three places — uncomment all three to re-enable it.

**Game status flows child → parent.** Each game component takes `onGameStatusChanged: (status: GameStatus) => void` and reports `NotStarted` / `Active` / `Complete`. App.tsx uses that solely to hook `window.onbeforeunload` and warn before losing an in-progress game. Games with their own richer state machine (e.g. `SkullKingGameStatus`: GameNotStarted → BiddingOpen → BiddingClosed → GameOver / EditingPastItem) map it down to `GameStatus` in a `useEffect`.

**Player persistence is cookies only, one cookie per game**, named `players_<abbrev>` (`players_sk`, `players_rtta`, `players_fhlh`). The value is player names joined by `|`. Scores are never persisted — refreshing loses the game, which is why the beforeunload warning exists. The read pattern is an unconditional `if (!cookies.x && players.length === 0) setPlayers(defaults)` in the render body (not an effect) — this is the established idiom across all three games.

**Shared plumbing in [src/common/](src/common/) and [src/components/](src/components/):**
- `player-utility.ts` — `addPlayer`/`editPlayer` take `(players, setPlayers, setCookie, ...)` and return an error string on duplicate names; each game wraps these with its own cookie name. `removePlayer` is *not* shared and is reimplemented per game.
- `player-list.tsx` — the roster UI used inside each game's settings modal; `playerType="teams"` switches the labels.
- `simple-modal.tsx` / `reset-game.tsx` — every game puts its player/options UI in a `SimpleModal` opened by a `Gear` button, plus a `ResetGame` button.
- `numeric-input-area.tsx` wraps `text-input-area.tsx`; numeric parse failures coerce to `0`.

**Per-game structure:** `src/games/<game>/<game>.tsx` is the orchestrator holding all state; subcomponents live in `src/games/<game>/components/` (roll-through-the-ages, first-hand-last-hand) or as siblings prefixed with the game name (skull-king).

Scoring rules are pure functions kept next to the game — e.g. `calculateRoundScore` and `getCurrentScores` in [skull-king.tsx](src/games/skull-king/skull-king.tsx). Put new scoring logic there rather than inline in JSX.

**Roll Through the Ages caches subcomponents as JSX in state** (`const [cities, setCities] = useState<JSX.Element>()`) and re-creates them in effects when props like `cityCount`/`monumentCount` change, using a `needsReset: boolean[]` array indexed by module-level constants. It's unusual; follow the existing pattern when editing that game rather than converting it piecemeal.

## Conventions

- UI is react-bootstrap; import from the `esm` paths the codebase already uses (`react-bootstrap/esm/Button`), icons from `react-bootstrap-icons`.
- Layout uses `Stack` with `gap`; one-off styling is inline `style={{}}`. `styled-components` is only used for the few shared styles in `common-styles.tsx`.
- Components are arrow-function consts exported by name, with an exported `<Name>Props` interface, destructured from `props` at the top of the body.
- Skull King colors are exported constants from `skull-king.tsx` (`defaultBlueColor`, `enabledButtonColor`, …) — reuse them instead of new literals.
