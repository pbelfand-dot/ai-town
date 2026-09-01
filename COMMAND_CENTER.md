# Emberhollow Command Center

A standing org of specialist agents, each owning one domain of the town.
Definitions live in `.claude/agents/` — any Claude Code session in this repo can
delegate to them by name via the Agent tool, and each can be spawned in parallel.

## Org chart

```
                    ┌─────────────────────┐
                    │  you + Claude (lead) │   integrates, ships, owns the repo
                    └──────────┬──────────┘
      ┌──────────────┬─────────┼──────────────┬────────────────┐
┌─────┴──────┐ ┌─────┴─────┐ ┌─┴────────────┐ ┌┴─────────────────┐
│ design-    │ │ sim-ai-   │ │ character-   │ │ town-code-       │
│ director   │ │ engineer  │ │ brain-keeper │ │ reviewer         │
│ (visuals)  │ │ (behavior,│ │ (minds, voices│ │ (bug hunts,     │
│            │ │ town life)│ │  & interviews)│ │  read-only)     │
└─────┬──────┘ └───────────┘ └──────────────┘ └──────────────────┘
┌─────┴──────┐
│ design-    │   reviews every visual change before merge:
│ critic     │   SHIP / SHIP WITH FIXES / REJECT
└────────────┘
```

## Who owns what

| Agent | Owns | Mode |
|---|---|---|
| `design-director` | Palette, sprites, canvas rendering, atmosphere, UI chrome | proposes drop-in code |
| `design-critic` | Art-direction fit, readability, perf cost of visual changes | read-only verdicts |
| `sim-ai-engineer` | Utility AI, needs, relationships, economy, communal buildings, festivals | proposes drop-in code |
| `character-brain-keeper` | Archetype brains, voices, fears/quirks, inheritance, `personaPrompt` | owns the brain schema |
| `town-code-reviewer` | Bugs: state corruption, sim math, canvas/camera, DOM, `sample` misuse | read-only findings |

Per-villager "brains" are data, not agents: the brain-keeper maintains one
schema and archetype library inside `index.html`, and every villager instance —
including the live Claude interview for that villager — reads their own brain
from it. That keeps a village of 26 minds affordable and consistent.

## Working agreement

1. Domain agents produce **anchored drop-in code** ("replace function X"),
   never vague direction.
2. Visual changes pass `design-critic` before merge.
3. The lead session integrates (single writer on `index.html`), runs
   `town-code-reviewer` on the result, fixes confirmed findings, republishes the
   artifact, and pushes.
4. Locked decisions: cozy-pixel-storybook art direction; single self-contained
   HTML file; the `sample` capability is only called from explicit viewer
   actions, never the sim loop.
