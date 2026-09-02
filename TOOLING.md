# Tooling audit — Master Directive Section 0

Honest status of every requested tool, audited 2026-09-02 in the Claude Code remote
environment. Rule followed: nothing reinstalled that works, nothing installed blindly,
nothing claimed that isn't real.

## Requested vs. actual

| Requested tool | Status here | Resolution |
|---|---|---|
| `frontend-design@claude-plugins-official` | **Not in this account's plugin catalog** (catalog is the knowledge-work marketplace; closest match is a Figma-workflow "design" plugin — wrong tool, not installed) | design-director charter already encodes the UI/visual-hierarchy discipline; HUD work reviewed by design-critic |
| `claude-code-setup` | Not in catalog | Repository analysis done directly (see DEVELOPMENT_PLAN.md §1); CLAUDE.md + hooks recommendations included there |
| Context7 (`ctx7` / MCP) | MCP servers cannot be attached mid-session in this environment | Low exposure: the game is dependency-free by design (artifact CSP forbids most external code). WebFetch/WebSearch cover doc lookups when needed |
| Playwright MCP | Cannot attach MCP mid-session | **Equivalent capability installed and verified**: `puppeteer-core` (npm) driving the pre-installed Chromium at `/opt/pw-browsers/chromium`. Launches the game, drives UI, reads console — see `tests/` |
| Chrome DevTools MCP | Cannot attach MCP mid-session | Same harness: console, pageerror, evaluate, screenshots, timing via puppeteer-core |
| `willibrandon/pixel-plugin` + Aseprite | **Aseprite is not installed in this container**; plugin not in catalog | Art remains canvas-procedural (crisp, versionable, zero assets to load). Conventions locked in ART_BIBLE.md. Aseprite pipeline is a local-machine option (below) |
| TypeScript language server | Project is single-file vanilla JS by design (artifact constraint) | `node --check` syntax gate + runtime test suite. TS not adopted — would require a build step the artifact pipeline doesn't have |
| Godot MCP | Project is Canvas/DOM — **no migration** (directive's own rule) | n/a |

## What the project actually uses

- **Runtime test harness**: `tests/run-tests.mjs` (puppeteer-core + system Chromium) —
  launches the real game headless, runs the deterministic scenarios from Master
  Directive §37 (RNG fingerprint, save roundtrip, interior observability, knowledge
  spread), fails loudly. This is the required "run the actual game" gate (workflow
  steps F–H).
- **Syntax gate**: extract inline `<script>` → `node --check` before any commit.
- **Screenshot look**: headless Chromium `--screenshot` for visual verification.
- **Agent org**: `.claude/agents/` — the five mandated development agents (see
  COMMAND_CENTER.md). NPCs are simulation data, never agents.

## If you (the owner) want the full local toolkit

On a local machine with Claude Code these work as specified in the directive:

```
/plugin install frontend-design@claude-plugins-official
/plugin install claude-code-setup@claude-plugins-official
npx ctx7 setup --claude
claude mcp add playwright npx @playwright/mcp@latest
claude mcp add chrome-devtools --scope user npx chrome-devtools-mcp@latest
claude plugin marketplace add willibrandon/pixel-plugin && claude plugin install pixel-plugin && /pixel-setup   # requires Aseprite
```

Inspect `willibrandon/pixel-plugin` (permissions, maintenance) before installing, per
the directive. None of these are required for the current test/verify loop to run.
