# Master Directive — Living AI Civilization Simulator (operative summary)

Archived 2026-09-02 from the owner's directive. This is the condensed rule set
every future session must honor; DEVELOPMENT_PLAN.md maps it to the codebase.

## North star
A massive, persistent, emergent civilization in a readable cozy pixel-storybook
top-down world (classic handheld-RPG clarity; original identity, no copied
assets/palettes). Alive with zero player input. NPCs live/work/learn/teach,
befriend/rival/date/marry/raise families, inherit traits, develop skills and
preferences, change appearance and fitness, build and upgrade homes, invent,
discover and share recipes, farm/cook/craft/trade, start businesses, change
careers, get rich or poor, form organizations and governments, vote, make and
protest laws, develop culture/traditions/classes, migrate, and build
increasingly sophisticated societies. **EMERGENCE OVER SCRIPTING** — never fake
it with predetermined events; systems interact so stories occur. The §42 test:
the bakery-child → herb bread → wheat prices → election → taxation chain must
be producible by systems, never a script — while any viewer instantly reads
"that little dude is walking home because it started raining."

## Standing process rules
- Tools first (§0, see TOOLING.md), then UNDERSTAND before coding (§1), then a
  written plan (§2), then autonomous implementation — stop only for destructive
  credentials, irreversible loss, or true ambiguity. Checkpoint before invasive
  work; never destroy working progress for cleanliness.
- Five development agents only (§3): design-director, design-critic (read-only
  gate), sim-ai-engineer, character-brain-keeper, town-code-reviewer
  (read-only). NPCs are DATA, never agents. Workflow (§4): propose → brain
  review if cognition → implement → critic verdict → reviewer trace → tests →
  run the game → inspect → merge. Disagreement over consensus.

## Non-negotiable engineering rules
- **RNG (§35)**: separate streams (world/sim/weather/cosmetic…). Cosmetics must
  never re-roll world layout, founders, names, personalities. Regression-test it.
- **Saves (§36)**: versioned, migrated, never silently destroyed; built for
  generations of history.
- **Time scales (§27)**: render 60fps; decisions 1–4 Hz; careers weekly-ish;
  politics event-driven. Never evaluate everything every frame.
- **Scale (§28)**: simulation LOD (near=full, offscreen=reduced, distant=
  aggregate with named-NPC identity); camera position must not change outcomes.
- **LLM use (§25–26)**: routine actions are deterministic utility AI; LLM only
  for rare high-value events via an importance classifier, with budgets,
  caching, batching. Thousands of villagers ≠ thousands of model calls.
- **Perf (§34)**: measurable budgets (frame, tick, allocations, pools, DOM);
  "should be fine" is banned — measure.
- **No fake features (§38)**: no dead buttons, no UI without data, no thoughts
  contradicting state, no fabricated tests, no mock state for screenshots.
- **No feature isolation (§39)**: every system declares its interactions
  (gym ↔ money/time/fitness/attraction/jobs/health/social; clothing ↔
  resources/economy/attraction/culture/weather; cooking ↔ farming/trade/
  knowledge/health/family/business).

## Simulation design rules
- **Buildings/interiors (§6–7)**: NPCs never vanish indoors; interiors are
  inspectable at readable zoom; furniture = capability (bed→sleep, stove→cook,
  bookshelf→learn, workbench→craft…). Homes evolve with wealth/family/culture
  and accumulate cross-generation history.
- **Clothing/body/grooming (§8–11)**: layered outfits reflecting profession/
  wealth/season/personality, eventually a fiber→tailor→fashion economy;
  gradual lifestyle-driven fitness (never random flips); an
  `appearanceInvestment` system with real costs; no universal beauty score.
- **Attraction (§12)**: personal, probabilistic, ASYMMETRIC preference
  profiles with variance; initial attraction ≠ long-term compatibility;
  familiarity can beat first impressions; no internet ideology as law.
- **Heredity & family (§13)**: probabilistic tendencies, never destiny; family
  knowledge/tools/contacts advantage learning; influence ≠ forced profession.
- **Careers (§14)**: scored choice — interest (heavy), aptitude, skill, family
  knowledge, mentor access, exposure, demand, pay, status, personality,
  education, relationships, need. People sometimes refuse optimal money.
- **Knowledge (§15–19)**: person-to-person transfer (parent/master/friend/
  school); individual → household → organizational → settlement → written.
  Skills grow by practice/instruction/observation with observable effects.
  Discovery needs motivation+prerequisites+materials+experimentation (wheat+
  water+fire → dough → bread), never `year===5` unlocks. Recipes are knowledge
  objects (ingredients, discoveredBy, knownBy, variants) that evolve. Tech is
  a prerequisite graph that changes society.
- **Economy/business/government (§20–22)**: goods come from and go somewhere;
  ownership, wages, prices, supply/demand; NPCs found businesses from skill+
  savings+demand+ambition; businesses succeed/fail/employ/inherit. Government
  EMERGES from pressures (disputes, land, defense, trade), takes varied forms,
  evolves; political behavior from values/class/relationships.
- **Social/memory (§23–24)**: relationships with history and typed roles, not
  bare numbers; meaningful memories that fade/strengthen/retell and drive
  opinions ("Lena helped me during the famine").
- **Observability (§29–31)**: click anyone → layered panel (identity, family,
  job, skills, goal, mood, relationships, wealth, knowledge, memories,
  thought); visible thoughts/speech turn math into stories; chronicle records
  births/deaths/marriages/discoveries/elections across generations.
- **Art (§32–33)**: Pixel Art Bible before significant new assets (tile size,
  sprite dims, palette, outline/shadow/light rules, animation counts, layering,
  integer scaling); every asset judged at 100% game scale by design-critic.

## Priority order (§40)
0 tooling/audit → 1 stability (RNG/saves/tests) → 2 canonical brain → 3 needs/
thoughts → 4 skills/jobs/mentorship → 5 observable interiors → 6 art bible →
7 clothing/grooming/body → 8 attraction/dating → 9 inheritance/teaching →
10 knowledge/recipes/discovery → 11 economy/businesses → 12 construction →
13 institutions → 14 government → 15 tech/culture → 16 LOD/scale → 17 LLM
routing. Foundations strictly before dependents (knowledge before schools;
ingredients before restaurants).
