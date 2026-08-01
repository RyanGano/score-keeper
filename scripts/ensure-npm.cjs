// Guard: this project is npm-only.
//
// Two entry points, both of which must work with an empty node_modules —
// so no imports and no dependencies. CommonJS because package.json sets
// "type": "module".
//
//  1. package.json "preinstall" and "prebuild" — npm sets
//     npm_config_user_agent (e.g. "npm/10.9.4 node/v22.22.0 win32 x64"),
//     and so do yarn, pnpm and bun. Anything that isn't npm is rejected.
//
//  2. .yarnrc "yarn-path" — yarn classic delegates every command to this
//     script *before* it parses package.json, which is the only hook that
//     fires early enough to replace yarn's own (garbled) complaint about
//     the "packageManager" field. Yarn invokes it with no user agent set,
//     which is why an absent agent is treated as "not npm".

const agent = process.env.npm_config_user_agent ?? "";
const manager = agent.split("/")[0] || "yarn";

if (manager !== "npm") {
  process.stderr.write(
    `
✖ This project uses npm. Detected: ${manager}

  Use npm instead:

    ${manager} install    ->  npm install    (or 'npm ci' for an exact,
    ${manager} add X      ->  npm install X       lockfile-only install)
    ${manager} remove X   ->  npm uninstall X
    ${manager} <script>   ->  npm run <script>

  Why this is enforced:

  The repo tracks package-lock.json and no other lockfile. Installing with
  ${manager} would resolve a different dependency tree from the one CI and the
  Azure Static Web Apps deploy use, and would leave a second lockfile behind.

  Yarn classic was dropped specifically because it is unmaintained and calls
  url.parse() and punycode internally, so every install on Node 22+ prints
  DEP0169/DEP0040 deprecation warnings that no one can act on. It also warns
  "Workspaces can only be enabled in private projects" for any dependency
  whose published manifest has a workspaces field. npm prints none of this.

  Changing package manager on purpose? Update these together:
  scripts/ensure-npm.cjs, .yarnrc, package.json ("packageManager", the
  preinstall/prebuild hooks), and .github/workflows/.

`.trimStart()
  );

  process.exit(1);
}
