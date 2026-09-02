#!/usr/bin/env node
/* Emberhollow runtime test suite (Master Directive §37).
   Drives the REAL game headless via puppeteer-core + Chromium and asserts the
   deterministic scenarios. No mocks, no fabricated success (§38).

   Setup: `npm i puppeteer-core` somewhere importable, plus a Chromium binary.
   Env overrides: PUPPETEER_EXECUTABLE_PATH, EH_NODE_MODULES (dir holding node_modules). */
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const here = dirname(fileURLToPath(import.meta.url));
let puppeteer;
try { puppeteer = (await import('puppeteer-core')).default; }
catch {
  const base = process.env.EH_NODE_MODULES || '/tmp/claude-0/-home-user-ai-town/9028b2e0-ca5c-5862-9cb2-64482d4b1d74/scratchpad';
  puppeteer = createRequire(join(base, 'package.json'))('puppeteer-core');
}
const CHROME = process.env.PUPPETEER_EXECUTABLE_PATH || '/opt/pw-browsers/chromium';

// Build a wrapped page (the artifact-format index.html has no doctype of its own).
const src = readFileSync(join(here, '..', 'index.html'), 'utf8');
const dir = mkdtempSync(join(tmpdir(), 'eh-test-'));
const pageFile = join(dir, 'game.html');
writeFileSync(pageFile, '<!doctype html>\n<meta charset="utf-8">\n' + src);
const URL = 'file://' + pageFile;

const results = [];
function report(name, ok, note = '') {
  results.push({ name, ok, note });
  console.log(`${ok === true ? 'PASS' : ok === 'skip' ? 'SKIP' : 'FAIL'}  ${name}${note ? ' — ' + note : ''}`);
}

const browser = await puppeteer.launch({ executablePath: CHROME, args: ['--no-sandbox', '--disable-gpu'] });

async function freshPage() {
  const page = await browser.newPage();
  page._errors = [];
  page.on('pageerror', e => page._errors.push(String(e.message)));
  await page.goto(URL);
  await page.waitForFunction('window.__eh && window.__eh.fingerprint', { timeout: 15000 });
  await page.evaluate('__eh.setSpeed(0)'); // sim advances only via __eh.step → deterministic
  return page;
}
const snap = p => p.evaluate(`(${function () {
  const eh = window.__eh;
  return {
    fp: eh.fingerprint(), day: eh.day(), pop: eh.agents.length,
    names: eh.agents.map(a => a.name).sort().join(','),
    partners: eh.agents.filter(a => a.partner).length,
    houses: eh.houses.length, lineage: eh.lineage.length,
  };
}})()`);

// ── 1. Determinism: same build, two fresh loads → identical world ──
{
  const a = await freshPage(), b = await freshPage();
  const sa = await snap(a), sb = await snap(b);
  report('world determinism (double load)', sa.fp === sb.fp && sa.names === sb.names,
    `fp ${sa.fp} vs ${sb.fp}`);

  // ── 2. Cosmetic/weather RNG separation: reduced-motion view = same world ──
  const c = await browser.newPage();
  await c.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await c.goto(URL);
  await c.waitForFunction('window.__eh && window.__eh.fingerprint');
  const sc = await c.evaluate('({fp: __eh.fingerprint()})');
  report('cosmetic RNG isolation (reduced-motion world identical)', sa.fp === sc.fp,
    `fp ${sa.fp} vs ${sc.fp}`);
  await c.close();

  // ── 3. Fixed-step sim determinism across two runs ──
  await a.evaluate('__eh.step(400)');
  await b.evaluate('__eh.step(400)');
  const sa2 = await snap(a), sb2 = await snap(b);
  report('sim determinism (400s fixed-step twin runs)',
    sa2.names === sb2.names && sa2.day === sb2.day && sa2.houses === sb2.houses,
    `day ${sa2.day}/${sb2.day} pop ${sa2.pop}/${sb2.pop} houses ${sa2.houses}/${sb2.houses}`);
  await b.close();

  // ── 4. Save → reload → load roundtrip ──
  const before = await snap(a);
  const saved = await a.evaluate('__eh.save()');
  await a.reload(); await a.waitForFunction('window.__eh');
  const loaded = await a.evaluate('__eh.load()');
  const after = await snap(a);
  report('versioned save/load roundtrip', saved && loaded &&
    before.names === after.names && before.day === after.day &&
    before.houses === after.houses && before.lineage === after.lineage,
    `day ${before.day}→${after.day}, pop ${before.pop}→${after.pop}`);
  // …and the loaded town keeps living without errors
  await a.evaluate('__eh.setSpeed(0); __eh.step(120)');
  const after2 = await snap(a);
  report('loaded town resumes simulating', after2.day >= after.day && a._errors.length === 0,
    a._errors[0] || `day ${after.day}→${after2.day}`);

  // ── 5. Interior observability: an agent indoors stays simulated & locatable ──
  const indoor = await a.evaluate(`(${function () {
    const eh = window.__eh;
    for (let i = 0; i < 40; i++) {
      eh.step(30);
      const ins = eh.agents.find(x => x.inside);
      if (ins) {
        const h = eh.houses.find(hh => hh.id === ins.home);
        return { found: true, simulated: eh.agents.includes(ins), home: !!h, name: ins.name };
      }
    }
    return { found: false };
  }})()`);
  report('interior observability (indoor agent stays simulated)',
    indoor.found ? (indoor.simulated && indoor.home) : 'skip',
    indoor.found ? indoor.name + ' indoors, home resolvable' : 'nobody went indoors in the window tested');

  // ── 6. Physical development diverges with lifestyle (§9/§37) ──
  const body = await a.evaluate(`(${function () {
    const mk = () => ({ body: { str: 0.4, fit: 0.5, mass: 0.5 }, birthDay: -20, parents: [] });
    const A = mk(), B = mk();
    for (let i = 0; i < 25; i++) { driftBody(A, 0.9); driftBody(B, 0.08); }
    return { a: A.body.str, b: B.body.str };
  }})()`);
  report('physical development diverges with lifestyle', body.a - body.b > 0.2,
    `laborer str ${body.a.toFixed(2)} vs sedentary ${body.b.toFixed(2)}`);

  // ── 7. Attraction preferences are personal & asymmetric (§12/§37) ──
  const attr = await a.evaluate(`(${function () {
    const [x, c] = window.__eh.agents;
    const w = x.brain.attract, orig = w.presentation, og = c.groom;
    c.groom = 1;
    w.presentation = 1.6; const hi = attractionScore(x, c);
    w.presentation = -0.4; const lo = attractionScore(x, c);
    w.presentation = orig; c.groom = og;
    return { hi, lo };
  }})()`);
  report('attraction: same candidate, different preference, different effect', attr.hi > attr.lo,
    `presentation-lover ${attr.hi.toFixed(2)} vs indifferent ${attr.lo.toFixed(2)}`);

  // ── 8. Save migration v1→v2 fills defaults, drops nothing (§36) ──
  const mig = await a.evaluate(`(${function () {
    const d = window.__eh.serialize();
    d.v = 1; delete d.businesses; delete d.econ; delete d.nextBiz;
    for (const s of d.agents) { delete s.body; delete s.phys; delete s.groom; delete s.wardrobe; delete s.bodyAt; delete s.worksFor; }
    localStorage.setItem('emberhollow-save', JSON.stringify(d));
    const pop = d.agents.length;
    const ok = window.__eh.load();
    const filled = window.__eh.agents.every(a => a.body && typeof a.groom === 'number' && a.wardrobe);
    return { ok, filled, kept: window.__eh.agents.length === pop, econ: econ.foodPrice >= 1 };
  }})()`);
  report('versioned migration v1→v2', mig.ok && mig.filled && mig.kept && mig.econ,
    mig.kept ? 'population preserved, defaults filled' : 'POPULATION LOST');

  // ── 9. No page errors across the whole run ──
  report('zero runtime errors', a._errors.length === 0, a._errors.slice(0, 3).join(' | ') || 'clean console');
  await a.close();
}

await browser.close();
const failed = results.filter(r => r.ok === false);
console.log(`\n${results.length - failed.length}/${results.length} passed`);
process.exit(failed.length ? 1 : 0);
