# Emberhollow — an AI town that runs itself

A single-file generative town simulation. Six founders arrive at a river bend with
no mayor and no script; everything after that is decided by the villagers themselves.

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

Controls: drag to pan · scroll to zoom · click a villager or cottage ·
speed controls (pause / 1× / 4× / 12×) in the header.
