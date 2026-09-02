# Emberhollow — project guide for Claude Code sessions

A living AI civilization simulator: persistent, emergent, presented as a cozy
pixel-storybook top-down world. Read `docs/MASTER_DIRECTIVE.md` for the full
north star; `DEVELOPMENT_PLAN.md` for current state and roadmap.

## Architecture (do not fight it)

- **One self-contained file**: `index.html` — content + CSS + all JS. It is
  published as a Claude Artifact (same URL every republish), so: no build step,
  no external libraries, no external assets; fonts from Google Fonts only.
  The file is authored artifact-style (no `<html>/<head>/<body>` wrapper).
- Canvas 2D, tile world (64×44, TILE=16), offscreen ground layer redrawn only
  when `groundDirty`. Sim state lives in module globals (`agents`, `houses`,
  `lineage`, `RECIPES`…). Time is sim-clocked (`simTime`, `DAY=75s`, 12-day
  seasons); rendering uses real dt (`drawDt`).
- **NPCs are data.** One brain object per villager (`a.brain`) is the single
  source of truth for both utility behavior and the live Claude interviews
  (`personaPrompt`). Never fork that.
- Live AI voices route through ONE backend adapter (`aiBackend`): Claude
  `sample` in the viewer, local Ollama on a local file, none otherwise — and
  are called ONLY from explicit viewer actions, never the sim loop or timers.

## Hard rules

- **RNG streams are separated** (world / sim / weather; cosmetics use
  Math.random). Cosmetic or weather code must NEVER consume the world or sim
  streams — there is a regression test for this. New subsystems get their own
  stream if they need determinism.
- **Saves are versioned** (`SAVE_V`). Schema changes require a migration in
  `migrateSave()`, never silent breakage of old saves.
- Emergence over scripting: no predetermined story events; systems interact.
- No fake features: no dead buttons, no UI for data that doesn't exist, no
  thoughts contradicting state, no fabricated test results.
- Preserve working behavior; checkpoint (`git tag`) before invasive work.
- Visual changes merge only after a `design-critic` verdict.
- Knowledge spreads person-to-person only; no global unlocks.

## The agent org

Five development agents in `.claude/agents/` (see COMMAND_CENTER.md): 
design-director, design-critic (read-only gate), sim-ai-engineer,
character-brain-keeper, town-code-reviewer (read-only). Use them for their
domains; the lead session is the single writer on `index.html`.

## Verify before pushing

```
# syntax gate
python3 -c "import re;open('/tmp/s.js','w').write(re.search(r'<script>(.*)</script>',open('index.html').read(),16).group(1))" && node --check /tmp/s.js
# runtime suite (real game, headless chromium)
node tests/run-tests.mjs
```

Artifact URL (republish to SAME url): https://claude.ai/code/artifact/e338c481-3eb7-40f5-94f6-8abadc58f6ee
Branch: `claude/ai-town-simulation-5t5yc4`. Never push elsewhere.
