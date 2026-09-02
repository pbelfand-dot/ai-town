# Emberhollow — Development Plan
### Living AI Civilization Simulator · plan of record (2026-09-02)

Produced per Master Directive §2 after full repository audit (§41 steps 1–28).
Checkpoint: git tag `checkpoint-pre-civilization` @ `9413c83`.

---

## 1. Current architecture

Single self-contained `index.html` (~1,900 lines) published as a Claude Artifact.
Canvas 2D tile world (64×44 tiles, 16px), offscreen static ground layer
(`groundCv`, invalidated by `groundDirty`), depth-sorted dynamic sprite pass,
additive light pass, particle pools. Sim-clocked time (`simTime`, 75s days,
12-day seasons, weather machine), real-dt decorative motion. DOM sidebar:
inspector (villager / cottage interior / communal building), chronicle, family
tree overlay. Live AI: the artifact `sample` capability powers in-character
villager interviews and chronicle summaries, on explicit viewer action only.
Camera: pan/zoom, CSS-pixel picking. No build step, no dependencies (CSP).

## 2. Systems already implemented

- Utility AI (`chooseTask` ladder): needs (rest/food/company/joy), sleep/forage,
  personal construction (plot scoring by personality, timber chop/haul/build),
  hobbies, socializing, market mornings (buy/sell), tavern evenings
  (auto-chat, reconciliation), festivals every 10th day.
- Character brains v1: 8 archetypes; per-NPC backstory, 2 voice rules, 2 values,
  fear, quirk, secret, signature phrase; trait-weighted archetype pick;
  inheritance of values/fears/quirks; brains drive chat topics, affinity
  (shared values warm, `grates` sour), thoughts, and the interview persona.
- Relationships: per-pair affinity, chat counts, friendship milestones,
  rivalry, romance → partnership → shared home → children (trait blending),
  aging (child/adult/elder), death, graves, grief.
- Town: houses styled per owner taste with furnished interiors; communal
  tavern + market built by collective labor; lineage registry + family tree UI.
- Atmosphere: seasons repaint ground/canopy; rain/drizzle/snow; fireflies;
  cloud shadows; graded dawn/dusk/night light; lantern/window glow.
- Chronicle (bounded), toasts, speed controls (0/1×/4×/12×).

## 3. Systems partially implemented

- Jobs: `jobOf` = first like (no career choice model) — §14 gap.
- Interiors: furnished but static; occupants invisible inside — §6 gap.
- Wealth/economy: barter flavor only; no stored wealth, prices, or scarcity.
- Knowledge: brains hold flavor but no skills, recipes, or discovery.
- Observability: good villager panel; no skills/goal/wealth display yet.

## 4. Technical debt

- One seeded RNG stream serves world-gen, sim, and weather (cosmetics already
  Math.random) — violates §35; separation is Phase 1.
- No persistence at all: reload loses the civilization — §36; Phase 1.
- No automated tests; verification is manual headless screenshots — §37.
- Single-file scale: ~1,900 lines now; fine to ~5–6k with section discipline,
  then revisit (a build step conflicts with the artifact pipeline — the split
  point is documented here deliberately early).
- `byId` is O(n) linear scan — fine ≤ ~100 agents; needs a Map at LOD phase.

## 5. Performance risks

- Sprite list rebuilt/sorted per frame (~200 entries, no closures) — fine now;
  becomes the first hot spot at 300+ entities → persistent arrays + dirty sort.
- Light pass is O(houses·owners) via linear `byId` — same threshold.
- A* worst case ~5k iterations; congestion at pop 30+ → path cache / flow
  fields at LOD phase. DOM chronicle capped (140 nodes) — safe.

## 6. Visual weaknesses

- Interiors static (no occupants) — biggest readability gap vs. §6.
- Villagers have no clothing layers; profession invisible at a glance (§8).
- No wealth/status signal on buildings beyond style; no snow footprints etc.

## 7. Simulation weaknesses

- No skills → mastery invisible, teaching impossible, careers shallow.
- Knowledge is universal-by-birth (recipes/professions not learned objects).
- Economy is decorative: nothing scarce, nothing owned beyond homes.
- Attraction = affinity threshold only; no personal preference profiles (§12).
- No goals; NPCs have moods but not aspirations (§29–30 depth).

## 8. AI weaknesses

- Everything is utility-tier; no importance classifier routing rare hard
  decisions to richer reasoning (§25) — acceptable until politics/negotiation.
- Interviews rebuild persona per call (correct, memory-less) but do not yet
  mention skills/goals/wealth (Brain v2).

## 9. Data-model weaknesses

- Task objects hold live references (`task.tree`, `task.bush`) — safe at
  runtime, fatal to naive serialization; save design drops transient task
  state (agents re-decide on load).
- `rel` Maps, `usedNames` Set, typed arrays (`ground/wear/solid`) need explicit
  encode/decode. `solid` is derivable (houses+trees) — rebuild, don't save.
- Chat turns for interviews stored on agents (fine; cap 10).

## 10. Save-compatibility risks

- No saves exist yet, so v1 defines the baseline: `{v:1,...}` with
  `migrateSave(old)` chain. Risks: brain schema growth (v2 adds attract/goal),
  RECIPES registry references, lineage growth. Rule: additive fields default
  in migration; never silently drop a civilization.

## 11. Testing weaknesses

None existed. Phase 1 adds the runtime suite (real game in headless Chromium
via puppeteer-core): determinism fingerprint, cosmetic-RNG regression, save
roundtrip, interior observability, knowledge non-teleportation, teaching.

## 12. Immediate priorities (this session)

P1 stability: RNG stream separation + versioned save/load + test harness.
P2–P5 foundations: skills, teaching, career choice, recipes/discovery, light
wealth; Brain v2 (attraction profiles, goals, persona v2); living interiors;
Pixel Art Bible; observability additions. All via the five-agent workflow.

## 13. Medium-term priorities

Clothing layers + grooming/`appearanceInvestment` (§8, §11); body/fitness
development from lifestyle (§9–10); real economy (prices from supply/demand,
stores, business founding/failure/inheritance §20–21); construction upgrades &
housing progression with family history (§7); education chain (knowledge →
teaching → school) (§15-seed exists after this session).

## 14. Long-term civilization roadmap

Institutions & civic systems → emergent government from pressures (disputes,
land, taxation — never "pop==50 ⇒ mayor") → laws/politics/elections → tech
prerequisites changing society (writing → records → administration; currency →
trade → merchants) → culture/traditions/social classes → migration & multiple
settlements → simulation LOD (near: full; offscreen: reduced; distant:
aggregate, identity kept for named NPCs; camera must not change outcomes) →
optional LLM routing for rare high-value decisions with budgets/caching (§25–26).

## 15. Files/modules likely to change

Everything lives in `index.html`; by section: RNG utils (top), brains block,
communal/jobs block, chooseTask/updateAgent/slowPulse, interiors
(furnish/drawInterior/renderInspector/refreshLive), persistence (new block),
frame. Docs: DEVELOPMENT_PLAN.md, ART_BIBLE.md, TOOLING.md, CLAUDE.md,
COMMAND_CENTER.md. Tests: `tests/run-tests.mjs` (+ page test API `window.__eh`).

## 16. Dependencies between phases

RNG streams ⟶ determinism tests ⟶ everything later trusts seeds.
Save v1 ⟶ any long-run civilization claims. Skills ⟶ teaching ⟶ careers ⟶
businesses. Recipes ⟶ discovery ⟶ food economy ⟶ restaurants. Wealth ⟶
prices ⟶ businesses ⟶ taxation ⟶ government. Interiors-observable ⟶ clothing
/grooming payoff. Attraction profiles ⟶ dating depth ⟶ family formation
variety. LOD last, after systems stabilize.

## 17. Acceptance tests per phase (deterministic, runnable)

- **P1 RNG**: same seed twice ⇒ identical world fingerprint (terrain hash,
  founder names/traits); toggling weather/cosmetics ⇒ fingerprint unchanged.
- **P1 Save**: run N sim-seconds, save, reload page, load ⇒ population, names,
  relationships, houses, day, lineage identical; agents resume acting.
- **P2 Brain**: every agent has brain; interview persona references the same
  goal/skills the panel shows (single source of truth).
- **P3 Thoughts**: every task type maps to a human-readable thought; no
  contradiction test (sleeping agent never "at the market").
- **P4 Skills/Careers**: practice raises skill with visible speed effect;
  carpenter's child gets family-knowledge career bonus but interest can win
  (cook-lover chooses cooking); teaching session transfers skill + memory.
- **P5 Interiors**: agent enters home ⇒ remains simulated, visible in interior
  view at correct furniture with correct activity summary.
- **P10 Knowledge**: one NPC discovers bread ⇒ only they know it; after
  teaching spouse ⇒ exactly two know it; no global unlock.
- **Perf**: 30 agents at 12× holds frame budget (no unbounded arrays; pools
  capped) — measured, not asserted.

---

## Phase roadmap (directive §40 mapped to reality)

| Phase | Directive | Status |
|---|---|---|
| 0 | Tooling + audit | ✅ shipped (TOOLING.md; honest gaps documented) |
| 1 | Stability: RNG streams, saves, tests | ✅ shipped — 7/7 runtime tests green |
| 2 | Canonical NPC brain | ✅ v1 + v2 (attraction profiles, goals) shipped |
| 3 | Needs/utility/thoughts | ✅ shipped incl. goal-flavored thoughts |
| 4 | Skills/interests/jobs/mentorship | ✅ foundational cut shipped (8 domains, careerFit, teaching) |
| 5 | Homes + observable interiors | ✅ shipped (occupants drawn at furniture, live summaries) |
| 6 | Visual system + art bible | ✅ shipped + ART_BIBLE.md |
| 7 | Clothing/grooming/body | 📋 next — layered sprites design in ART_BIBLE |
| 8 | Relationships/attraction/dating | ✅ attraction profiles shipped; dating depth next |
| 9 | Inheritance/teaching/lineage | ✅ lineage + teaching + brain/skill inheritance shipped |
| 10 | Knowledge/recipes/discovery | ✅ foundational cut shipped (person-to-person only) |
| 11 | Economy/businesses | 📋 wealth + market trades shipped; prices/businesses next |
| 12 | Construction/expansion | 📋 |
| 13 | Institutions | 📋 |
| 14 | Government/laws | 📋 (emerges from pressures, never population thresholds) |
| 15 | Technology/culture | 📋 (prerequisite graph, no year-gates) |
| 16 | LOD / large populations | 📋 (byId→Map, sprite persistence, aggregate settlements) |
| 17 | LLM decision routing | 📋 (importance classifier; budgets; `sample` stays viewer-action-only until then) |

Implementation proceeds autonomously in phase order; stops only for destructive
credentials, irreversible data loss, or unresolvable ambiguity.
