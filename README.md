# Emberhollow — an AI town that runs itself

A single-file generative town simulation. Six founders arrive at a river bend with
no mayor and no script; everything after that is decided by the villagers themselves.

Built and maintained by the **Emberhollow Command Center** — a standing org of
specialist agents (design-director + design-critic, sim-ai-engineer,
character-brain-keeper, town-code-reviewer) defined in `.claude/agents/`.
See `COMMAND_CENTER.md` for the org chart and working agreement.

## Round 5 (Homes with History & the Schoolhouse — phases 12 & 13)

- **Housing evolves (§7)**: cottages upgrade to improved cottages and
  townhouses when prosperity, skill (or a paid builder) and fresh timber
  meet — dormers, stone footings, gilt lintels appear on the sprite, and
  upgraded homes gain furniture while keeping their heirlooms.
- **Houses remember (§7)**: every home keeps a written history — ground
  broken, roofs raised, children born under it, couples joining their lives,
  inheritances — shown in the cottage inspector like a family deed. The
  family cottage passes to an heir who lacks a roof.
- **The schoolhouse (§15)**: the town's third communal build rises when the
  children are many. A teacher is chosen daily from the most knowing free
  adults; mornings fill with letters and crafts, pupils carry home memories
  of who taught them what. Knowledge → learning → teachers → school,
  in dependency order.
- Save schema **v3** (migrated), suite now **12/12** including the housing
  upgrade path and school-teaching acceptance tests.

## Round 4 (Bodies, Wardrobes & the Coin — phases 7 & 11)

- **Bodies from lifestyle (§9)**: labor accumulates real exertion; a daily
  drift moves strength and fitness toward the life actually lived — never a
  random flip. Strong builders visibly broaden; elders soften. Tested:
  laborer vs sedentary twins diverge (0.77 vs 0.25 strength).
- **Grooming / appearanceInvestment (§11)**: presentation fades without care;
  villagers spend real morning time making themselves presentable. Visible
  (unkempt strands), felt (a `presentation` attraction weight — only for
  those who care), and honest (it costs time).
- **Clothing (§8)**: composable draw-time layers — trade workwear (baker's
  flour-cream apron, angler's river-slate smock, builder's tool belt) and
  festival sashes **bought from a tailor**, the first link of the
  fiber→tailor→clothing→fashion economy.
- **Prices (§20)**: the meal price breathes with supply and demand; shortages
  print "Bread is selling for far too much" and pull career choices toward
  food trades.
- **Businesses (§21)**: skilled, solvent, ambitious villagers found named
  businesses ("Oren's Ovens"), which collect takings, hire taught
  apprentices, shutter when custom dries up, and pass to children on death.
- Save schema **v2** with a real v1→v2 migration (tested: population
  preserved, defaults filled). Test suite now **10/10**.

## Round 3 (Civilization Foundations — Master Directive phases 0–5)

- **Stability (§35–37)**: seeded RNG split into world / sim / weather streams
  (cosmetics use Math.random) — toggling atmosphere can never re-roll the town;
  **versioned save/load** (auto-save + header buttons, migration hook, survives
  reloads for generational play); a real runtime test suite
  (`tests/run-tests.mjs`, puppeteer + headless Chromium) — **7/7 passing**:
  determinism fingerprint, cosmetic-RNG isolation, fixed-step twin runs,
  save roundtrip, resumed simulation, interior observability, zero errors.
- **Skills & mastery (§16)**: eight craft domains grown by practice and
  teaching, with observable effects (faster building, richer foraging, named
  market wares, "spoken of as a master" moments) and Craft bars in the panel.
- **Careers (§14)**: scored choice — interest weighted heaviest, then aptitude,
  skill, family knowledge, mentor access, town demand, and need. People
  change trades on the record: "the heart wants what it wants."
- **Teaching (§15)**: parents teach children, masters take apprentices;
  knowledge and recipes move person-to-person only.
- **Discovery (§17–18)**: recipes are knowledge objects. Nobody is born
  knowing bread — someone experiments, discovers it, and for a while is the
  ONLY one who knows; variants get invented and named after their makers.
- **Attraction & goals (§12, Brain v2)**: per-villager asymmetric preference
  profiles (with inverted preferences and a familiarity weight — the
  overlooked can become beloved); every villager carries one active life
  goal that colors thoughts, resolves into memories, and shows in the panel.
- **Living interiors (§6)**: villagers no longer vanish indoors — the interior
  view draws them at the right furniture (asleep in bed, at the stove
  experimenting, reading by the shelf) with a live occupant summary; tavern
  and market get interiors with patrons at the tables and stalls.
- Governance docs: `DEVELOPMENT_PLAN.md`, `docs/MASTER_DIRECTIVE.md`,
  `ART_BIBLE.md`, `TOOLING.md`, `CLAUDE.md`.

## Round 2 (Command Center release)

- **Character brains** — 8 archetypes (the Tender, the Maker, the Wanderer, the
  Keeper of Stories, the Dreamer, the Steady Hand, the Listener, the Ember).
  Every villager gets a backstory, hard voice rules, two values, a fear, a quirk,
  and a secret they deflect about in interviews. Children inherit brain fragments.
  One brain drives both the sim and the live Claude interviews.
- **Town life** — a communal tavern and market hall the whole town builds with no
  foreman; jobs from each villager's passions with morning market stalls; evenings
  at the tavern where rivals reconcile over a shared jug; festivals every 10th day
  (the Harvest Fair, River Lantern Night, Founders' Day); a full family-tree
  overlay (the "lineage" button) that survives deaths.
- **Seasons & weather** — 12-day seasons repaint the world (blossoms, dry olive
  autumn with falling leaves, snow); rain, drizzle and snow from a sim-clocked
  weather machine; fireflies on clear nights; drifting cloud shadows; a graded
  dawn-rose / dusk-amber / night-violet light with lantern and window glow.
- **15 verified bug fixes** from the town-code-reviewer, including double-applied
  chat affinity, hiDPI click picking, orphaned scaffolds on death, and grown
  children now leaving home to build their own cottages.

## What the villagers do on their own

- **Personalities & tastes** — every villager rolls six traits (sociable, industrious,
  artistic, wild-hearted, curious, orderly) and 2–3 loves (fishing, painting,
  stargazing, baking…). Children inherit a blend of their parents' traits, with mutation.
- **Build homes how they like them** — each adult scores plots across the map
  (near friends if sociable, near the river if they fish, near the grove if
  wild-hearted, on the quiet edge if not), cuts timber, hauls it, and raises a
  cottage whose wall color, roof shape, banner, and flower beds come from their own
  traits. **Interiors are furnished to taste** — easels, bookshelves, lutes, bread
  ovens, friendly clutter — click a finished cottage to step inside.
- **Make friends** — villagers seek each other out, chat about shared (or clashing)
  interests, and drift into friendships, rivalries, and partnerships based on
  compatibility. Partners move in together; the cottage is refurnished for two.
- **Reproduce** — settled pairs have children, who grow up over the days, inherit
  blended personalities, and eventually build homes of their own.
- **Live full lives** — needs (rest, food, company, joy), hobbies, a day/night cycle,
  worn footpaths where people actually walk, chimney smoke, and — eventually —
  gravestones and grief. The Town Chronicle records all of it.

## Live AI minds (on claude.ai)

When the page is opened as a Claude artifact, it declares the `sample` capability:

- **Interview any villager** — click them and ask anything; Claude answers in
  character using that villager's real traits, relationships, and memories from
  *this* run.
- **"Claude, tell today's story"** — the chronicler writes a storybook entry from the
  actual event log.

Opened as a plain file, those two features hide themselves and the town runs
entirely on its built-in utility AI.

## Running it

- **Easiest**: open the published Claude artifact link (no setup at all).
- **Locally**: open `index.html` in any browser. (The file is authored in Claude's
  artifact format — no `<html>/<head>` wrapper — which browsers render fine.)

## Run it locally on a Mac (fully offline, no Claude)

The entire civilization is plain JavaScript — nothing ever leaves your machine.

1. Get the file: `git clone https://github.com/pbelfand-dot/ai-town` (or download
   `index.html` from the repo).
2. Double-click `index.html` — opens in Safari/Chrome and runs. Saves live in
   that browser (💾 save / ⭯ load in the header, plus a quiet auto-save).

**Optional — local AI voices** (villager interviews + the chronicle button,
powered by a model on YOUR Mac instead of Claude):

1. Install [Ollama](https://ollama.com) (`brew install ollama` or the app).
2. Pull a small model: `ollama pull llama3.2` (any Llama/Qwen/Mistral/Gemma/Phi works).
3. Start it so the browser may talk to it: `OLLAMA_ORIGINS="*" ollama serve`
4. Reload the local `index.html` — a toast confirms
   *"Local AI voices ready — llama3.2 via Ollama"*, and interviews stream from
   your own hardware. (Apple-silicon Macs run 3B models very comfortably.)

Backend routing (§25–26): Claude `sample` in the viewer → local Ollama on a
local file → none (features hide; the town runs regardless). The simulation
itself NEVER calls any model.

Controls: drag to pan · scroll to zoom · click a villager or cottage ·
speed controls (pause / 1× / 4× / 12×) in the header.
