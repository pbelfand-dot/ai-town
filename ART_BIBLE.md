# Emberhollow Pixel Art Bible (§32)

**Since round 9 the world renders from the Ninja Adventure asset pack**
(Pixel-boy & AAA, CC0), embedded as data URIs and cropped via the `NAC`
table; the hand-drawn art below remains as the pre-decode fallback and the
open-roof interiors. New art must match NA's outlined 16px idiom; UI,
light pass, particles, and interiors still follow the rules below.

The binding conventions of the cozy-pixel-storybook look, documented from the
shipped code. Change these deliberately or not at all; design-critic enforces
them at 100% game scale (§33).

## Scale & grid
- **Base tile: 16px** (`TILE=16`), world 96×64 tiles (the geography constants
  `RIVER_X`/`PLAZA`/`BRIDGE_YS` are the only source of coordinates).
- Villager sprite: ~10px wide × ~17px tall footprint (8×7 body, r=4 head,
  3px hair/hat band, 2×3 legs), drawn about a center origin; children scale
  0.62→1.0 by age. Houses 3×3 tiles; communal halls 4×3 with taller ridge.
- Interior canvas: 238×150 at a 34×30 cell grid (7×4 usable cells), scale
  ~2× world density so activity reads clearly.
- `imageSmoothingEnabled=false` everywhere; DPR capped at 2; camera zoom
  clamps 0.7–3.4. Limb animation steps in WHOLE pixels (`Math.round`).

## Palette
UI tokens: ink `#0f1512`, panel `#171f1a`/`#1e2a22`, line `#2b3a2f`, parchment
`#e9e2cf`, muted `#96a591`, brass `#d8a24a`, meadow `#84b06a`, rose `#dd8f9f`,
sky `#8fb5c9`. Seasonal grass ramps (5 values each) and canopy pairs live in
`GRASS_RAMPS` / `CANOPY` — spring fresh-green, summer (the original ramp),
autumn dry-olive, winter snow blue-grey. New assets must draw from these
ramps or harmonize with the token family; villager/house identity hues come
from per-agent `hue` via `hsl()`. Semantic warm light is always the
`#f0c060`/`#ffd678` family.

## The ages (era rendering)
`town.era` re-dresses the world from the same token family: wear paths run
dirt → gravel (#6f6a58/#96907f) → flagstone (#767162/#8f8a7c, joint lines);
bridges plank → dressed stone (#8d8578, #6b665c parapets, lamp posts era 3);
the plaza well → fountain + checkered paving (#a29b8b/#98917f) + striped
stalls (rose/brass/meadow). House materials by `h.mat`: hut (hue-desaturated
daub + #b08d4a thatch), timber (the original), stone (#9b948a walls,
#5c6672 slate), city (#b3a892 plaster, #454b59 slate, #8d8578 quoins).
Identity survives every age: the owner's hue moves to the painted door.
**Open-roof view**: at zoom ≥ 2.2 roofs peel away (cutaway ink #241c12,
floors by material via FLOOR_BY_MAT); furniture sprites stay ≤7px with
owner-hue accents; occupants are 3×4 mini-figures at their real furniture.

## Light & shadow
- One light direction: highlights upper-left (canopy lobe, roof ridge
  strokes), eaves shadow under rooflines, dark foundation skirts.
- No hard outlines; forms ground with darker bottom rows + soft ellipse
  shadows (`rgba(0,0,0,.25)`), which never bob with the sprite.
- Glow = `drawGlow` stepped circles under `globalCompositeOperation:'lighter'`.
  **No gradient objects, ever.** Night is the graded `gradeTint` wash
  (rose dawn / amber-plum dusk / blue-violet night), alpha ≤ .48.

## Animation
- Walk: sine bob (±1.2px) + alternating whole-pixel legs/arms on the shared
  phase `simTime*10+id`. Chimney smoke: 3 drifting puffs. Fireflies pulse on
  `atmoClock`. Decorative motion uses REAL dt (`drawDt`) and must check
  `REDUCED_MOTION` (sampled once) to still or halve itself.
- Particle pools are preallocated and capped: 80 precip + 24 fireflies +
  14 drift + 4 cloud shadows. Zero steady-state allocation; viewport modulo
  wrap. New effects must pool the same way.

## Performance rules
- Static art belongs on the offscreen ground layer (`groundCv`), repainted
  only when `groundDirty` (season flips, worn-path thresholds, graves).
- Per-frame work is O(entities+particles); sprite list is kind-tagged
  (no closures). Cosmetic randomness uses `Math.random` — NEVER `rnd()`
  (seeded streams are world/sim/weather only).

## UI
Type: Fraunces (display), Atkinson Hyperlegible (body), IBM Plex Mono (data,
`tabular-nums`). Chrome idiom: `.pill` capsules, `.chip` tags, `.bar` meters
(meadow=needs, rose=company, brass=joy/skills), `.secl` rules, `.ent`
chronicle rows. Semantic state colors stay separate from the brass accent.

## Clothing layers (§8)
Looks are composed at draw time in `drawAgent`, never baked into sprites.
Layer order: legs → body (+`broad` width for str>0.7; +1px-per-side lower
torso in the same body color while `pregnant`) → hem shade →
clothing layer (workwear apron/smock from `WORK_LOOK`, or festival sash at
complementary hue `(hue+180)%360`) → arms → head → hair/hat (+unkempt
strands when groom<0.3). Workwear colors are muted trade-mnemonics
(flour-cream, field-green, river-slate, timber-brown, dye-plum, coin-ochre);
identity color stays the owner's `hue`. New layers must keep the silhouette
readable at zoom 1 and never cover the carried-timber sprite or hats.

## Adding assets
1. Silhouette first — must read at zoom 1 against every seasonal ramp.
2. Reuse the ramps/tokens; identity color only via owner `hue`.
3. Respect the light direction and grounding rules above.
4. Static → ground layer; animated → pooled and reduced-motion-aware.
5. design-critic verdict before merge, judged at 100% game scale.
