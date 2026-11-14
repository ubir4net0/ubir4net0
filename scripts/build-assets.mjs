// Regenerates the static SVGs in assets/ (banner, footer, language and activity snapshots, project cards).
// Usage: node scripts/build-assets.mjs [outDir=assets]   — edit the data below, then rerun.
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const OUT = process.argv[2] || 'assets';
mkdirSync(join(OUT, 'projects'), { recursive: true });

const C = { bg: '#0D1117', panel: '#161B22', line: '#21262D', border: '#30363D', blue: '#00BFFF', deep: '#2563EB', white: '#F0F6FC', gray: '#8B949E' };
const SANS = "'Segoe UI', Inter, -apple-system, BlinkMacSystemFont, Helvetica, Arial, sans-serif";
const MONO = "'JetBrains Mono', 'Cascadia Code', Consolas, 'SFMono-Regular', Menlo, monospace";
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const accentDef = `<linearGradient id="accent" x1="0" x2="1"><stop offset="0" stop-color="${C.deep}"/><stop offset="1" stop-color="${C.blue}"/></linearGradient>`;
const save = (name, svg) => writeFileSync(join(OUT, name), svg.trim() + '\n');

function wrap(text, max) {
  const words = text.split(' '); const lines = []; let cur = '';
  for (const w of words) { if ((cur + ' ' + w).trim().length > max) { lines.push(cur.trim()); cur = w; } else cur += ' ' + w; }
  if (cur.trim()) lines.push(cur.trim());
  return lines;
}

// ---------------------------------------------------------------- banner
{
  const W = 1280, H = 360;
  const code = [
    [['kw', 'export const '], ['id', 'dev'], ['p', ' = {']],
    [['id', '  role'], ['p', ': '], ['str', '"full stack"'], ['p', ',']],
    [['id', '  backend'], ['p', ': ['], ['str', '"Laravel"'], ['p', ', '], ['str', '"NestJS"'], ['p', '],']],
    [['id', '  frontend'], ['p', ': ['], ['str', '"Vue"'], ['p', ', '], ['str', '"React"'], ['p', '],']],
    [['id', '  data'], ['p', ': ['], ['str', '"PostgreSQL"'], ['p', ', '], ['str', '"MySQL"'], ['p', '],']],
    [['id', '  ships'], ['p', ': '], ['kw2', 'true'], ['p', ',']],
    [['p', '};']],
  ];
  const color = { kw: '#5B8DEF', kw2: C.blue, id: C.white, str: C.blue, p: C.gray };
  const px = 772, py = 64, pw = 444, ph = 236;
  const codeSvg = code.map((parts, i) => {
    const y = py + 74 + i * 22;
    const spans = parts.map(([t, s]) => `<tspan fill="${color[t]}">${esc(s)}</tspan>`).join('');
    return `<text x="${px + 26}" y="${y}" fill="${C.border}" font-family="${MONO}" font-size="13">${i + 1}</text>
    <text x="${px + 52}" y="${y}" font-family="${MONO}" font-size="14.5" xml:space="preserve">${spans}</text>`;
  }).join('\n    ');
  const cursorY = py + 74 + 6 * 22;
  save('banner.svg', `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="title desc">
  <title id="title">Ubirajara Neto — Full Stack Developer</title>
  <desc id="desc">Full Stack Developer from Manaus, Brazil. Building web systems end to end: APIs, interfaces and the pipelines that keep them shipping.</desc>
  <defs>
    ${accentDef}
    <pattern id="dots" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.1" fill="#1F2A37"/></pattern>
    <radialGradient id="glow" cx="0.78" cy="0.45" r="0.55"><stop offset="0" stop-color="${C.deep}" stop-opacity="0.22"/><stop offset="1" stop-color="${C.deep}" stop-opacity="0"/></radialGradient>
    <linearGradient id="fade" x1="0" x2="1"><stop offset="0.25" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity="1"/></linearGradient>
    <mask id="dotmask"><rect width="${W}" height="${H}" fill="url(#fade)"/></mask>
    <clipPath id="clip"><rect width="${W}" height="${H}" rx="18"/></clipPath>
  </defs>
  <g clip-path="url(#clip)">
    <rect width="${W}" height="${H}" fill="${C.bg}"/>
    <rect width="${W}" height="${H}" fill="url(#dots)" mask="url(#dotmask)"/>
    <rect width="${W}" height="${H}" fill="url(#glow)"/>
    <rect y="${H - 3}" width="${W}" height="3" fill="url(#accent)"/>
  </g>
  <rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="18" fill="none" stroke="${C.line}"/>

  <text x="72" y="104" fill="${C.blue}" font-family="${MONO}" font-size="15" letter-spacing="1">~/ubir4net0 · manaus, br</text>
  <text x="70" y="170" fill="${C.white}" font-family="${SANS}" font-size="60" font-weight="700" letter-spacing="-1">Ubirajara Neto</text>
  <text x="72" y="214" fill="url(#accent)" font-family="${SANS}" font-size="27" font-weight="600">Full Stack Developer</text>
  <text x="72" y="262" fill="${C.gray}" font-family="${SANS}" font-size="18">Building web systems end to end — APIs, interfaces</text>
  <text x="72" y="288" fill="${C.gray}" font-family="${SANS}" font-size="18">and the pipelines that keep them shipping.</text>

  <rect x="${px}" y="${py}" width="${pw}" height="${ph}" rx="12" fill="${C.panel}" stroke="${C.border}"/>
  <line x1="${px}" y1="${py + 38}" x2="${px + pw}" y2="${py + 38}" stroke="${C.line}"/>
  <circle cx="${px + 22}" cy="${py + 19}" r="5" fill="${C.border}"/>
  <circle cx="${px + 40}" cy="${py + 19}" r="5" fill="${C.border}"/>
  <circle cx="${px + 58}" cy="${py + 19}" r="5" fill="${C.deep}"/>
  <text x="${px + pw - 20}" y="${py + 24}" text-anchor="end" fill="${C.gray}" font-family="${MONO}" font-size="12">profile.ts</text>
    ${codeSvg}
  <rect x="${px + 52 + 2 * 8.7 + 4}" y="${cursorY - 13}" width="8" height="16" fill="${C.blue}">
    <animate attributeName="opacity" values="1;1;0;0" keyTimes="0;0.5;0.5;1" dur="1.1s" repeatCount="indefinite"/>
  </rect>
</svg>`);
}

// ---------------------------------------------------------------- footer
save('footer.svg', `
<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="96" viewBox="0 0 1280 96" role="img" aria-labelledby="t">
  <title id="t">Ubirajara Neto · Full Stack Developer · Manaus, Brazil</title>
  <defs>
    <linearGradient id="line" x1="0" x2="1">
      <stop offset="0" stop-color="${C.deep}" stop-opacity="0"/><stop offset="0.5" stop-color="${C.blue}"/><stop offset="1" stop-color="${C.deep}" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect x="140" y="20" width="1000" height="1.5" fill="url(#line)"/>
  <circle cx="640" cy="20.75" r="3.5" fill="${C.blue}"/>
  <text x="640" y="62" text-anchor="middle" fill="${C.gray}" font-family="${MONO}" font-size="14" letter-spacing="1.5">ubirajara neto  ·  full stack developer  ·  manaus — br</text>
</svg>`);

// ---------------------------------------------------------------- languages (audit snapshot)
{
  const total = 772;
  const rows = [['TypeScript', 221], ['JavaScript', 176], ['PHP', 148], ['SQL', 62], ['Vue', 46], ['Java', 29], ['Python', 6]];
  const W = 840, top = 92, step = 30, H = top + rows.length * step + 30;
  const x0 = 150, x1 = 700, max = rows[0][1];
  const bars = rows.map(([name, n], i) => {
    const y = top + i * step; const w = Math.max(4, ((x1 - x0) * n) / max);
    return `<text x="24" y="${y + 13}" fill="${C.white}" font-family="${SANS}" font-size="14">${name}</text>
  <rect x="${x0}" y="${y + 2}" width="${x1 - x0}" height="14" rx="7" fill="${C.panel}"/>
  <rect x="${x0}" y="${y + 2}" width="${w.toFixed(1)}" height="14" rx="7" fill="url(#accent)"${i > 2 ? ' opacity="0.75"' : ''}/>
  <text x="${W - 24}" y="${y + 13}" text-anchor="end" fill="${C.gray}" font-family="${MONO}" font-size="12.5"><tspan fill="${C.white}">${n}</tspan>  ${Math.round((n * 100) / total)}%</text>`;
  }).join('\n  ');
  save('languages.svg', `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="t d">
  <title id="t">Languages in my commits</title>
  <desc id="d">Share of 772 authored commits that touch each language: ${rows.map(([n, v]) => `${n} ${v}`).join(', ')}. Audit of 2026-11-13.</desc>
  <defs>${accentDef}</defs>
  <rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="14" fill="${C.bg}" stroke="${C.line}"/>
  <rect x="24" y="24" width="3" height="18" rx="1.5" fill="url(#accent)"/>
  <text x="36" y="39" fill="${C.white}" font-family="${SANS}" font-size="16" font-weight="600">Languages in my commits</text>
  <text x="24" y="66" fill="${C.gray}" font-family="${MONO}" font-size="12">commits touching each language · 772 authored commits · 42 repos · audit 2026-11-13</text>
  ${bars}
</svg>`);
}

// ---------------------------------------------------------------- activity (audit snapshot)
{
  const months = [['Dec', 13], ['Jan', 28], ['Feb', 11], ['Mar', 3], ['Apr', 13], ['May', 13], ['Jun', 1], ['Jul', 61], ['Aug', 52], ['Sep', 24], ['Oct', 268], ['Nov', 242]];
  const W = 840, H = 330;
  const cx0 = 32, cBase = 268, cH = 160, step = 40, bw = 24, max = 268;
  const bars = months.map(([m, n], i) => {
    const x = cx0 + i * step; const h = Math.max(2, (cH * n) / max);
    const partial = i === months.length - 1;
    return `<rect x="${x}" y="${(cBase - h).toFixed(1)}" width="${bw}" height="${h.toFixed(1)}" rx="4" fill="url(#vaccent)"${partial ? ' opacity="0.55"' : ''}/>
  <text x="${x + bw / 2}" y="${(cBase - h - 7).toFixed(1)}" text-anchor="middle" fill="${n > 40 ? C.white : C.gray}" font-family="${MONO}" font-size="11">${n}</text>
  <text x="${x + bw / 2}" y="${cBase + 20}" text-anchor="middle" fill="${C.gray}" font-family="${SANS}" font-size="12">${m}${partial ? '*' : ''}</text>`;
  }).join('\n  ');
  const tl = [
    ['2024', '6 commits', 'PHP · Laravel'],
    ['2025', '50 commits', 'Laravel · Filament · Livewire'],
    ['2026', '716 commits', 'TypeScript · NestJS · Vue · React', 'Laravel · Java · Spring Boot'],
  ];
  const tx = 540, ty0 = 136;
  const timeline = tl.map(([y, c, a, b], i) => {
    const yy = ty0 + i * 62;
    return `<circle cx="${tx}" cy="${yy - 5}" r="5" fill="${i === 2 ? C.blue : C.bg}" stroke="${C.blue}" stroke-width="1.5"/>
  <text x="${tx + 18}" y="${yy}" fill="${C.white}" font-family="${SANS}" font-size="15" font-weight="600">${y} <tspan fill="${C.gray}" font-weight="400" font-family="${MONO}" font-size="12">  ${c}</tspan></text>
  <text x="${tx + 18}" y="${yy + 20}" fill="${C.gray}" font-family="${SANS}" font-size="13">${a}</text>${b ? `
  <text x="${tx + 18}" y="${yy + 38}" fill="${C.gray}" font-family="${SANS}" font-size="13">${b}</text>` : ''}`;
  }).join('\n  ');
  save('activity.svg', `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="t d">
  <title id="t">Development activity</title>
  <desc id="d">Authored commits per month from December 2025 to November 2026 (November partial): ${months.map(([m, n]) => `${m} ${n}`).join(', ')}. Stack over time: 2024 PHP and Laravel, 6 commits; 2025 Laravel, Filament and Livewire, 50 commits; 2026 TypeScript, NestJS, Vue, React, Laravel, Java and Spring Boot, 716 commits.</desc>
  <defs>${accentDef}<linearGradient id="vaccent" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${C.deep}"/><stop offset="1" stop-color="${C.blue}"/></linearGradient></defs>
  <rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="14" fill="${C.bg}" stroke="${C.line}"/>
  <rect x="24" y="24" width="3" height="18" rx="1.5" fill="url(#accent)"/>
  <text x="36" y="39" fill="${C.white}" font-family="${SANS}" font-size="16" font-weight="600">Development activity</text>
  <text x="24" y="66" fill="${C.gray}" font-family="${MONO}" font-size="12">authored commits per month · public + private repos, all branches · audit 2026-11-13</text>
  <line x1="${cx0 - 8}" y1="${cBase}" x2="${cx0 + 11 * step + bw + 8}" y2="${cBase}" stroke="${C.line}"/>
  ${bars}
  <text x="${cx0 - 8}" y="${H - 16}" fill="${C.gray}" font-family="${SANS}" font-size="11">* month in progress</text>
  <line x1="${tx - 26}" y1="96" x2="${tx - 26}" y2="${H - 24}" stroke="${C.line}"/>
  <text x="${tx}" y="${ty0 - 30}" fill="${C.blue}" font-family="${MONO}" font-size="12" letter-spacing="1">STACK OVER TIME</text>
  <line x1="${tx}" y1="${ty0}" x2="${tx}" y2="${ty0 + 2 * 62 - 10}" stroke="${C.border}" stroke-dasharray="2 4"/>
  ${timeline}
</svg>`);
}

// ---------------------------------------------------------------- project cards
const projects = [
  {
    file: 'health-platform.svg', tag: 'PRIVATE · TEAM PROJECT', title: 'Health Benefits Platform',
    desc: 'In-house replacement for a third-party SaaS: subscriptions, beneficiaries, clinic scheduling, exams and affiliate commissions across four portals.',
    mine: 'My part: immutable financial ledger, outbound webhooks, commission engine, migrations and Playwright E2E — 270+ commits.',
    chips: ['NestJS', 'TypeORM', 'PostgreSQL', 'Vue 3', 'Capacitor', 'Docker', 'Playwright'],
  },
  {
    file: 'distributed-pos.svg', tag: 'PUBLIC · SOLO · ACADEMIC', title: 'Distributed POS', link: true,
    desc: 'Point-of-sale system with an independent worker: idempotent checkout, stock reservations and transactional outbox/inbox messaging.',
    mine: 'Sole author: API, worker, React UI, OpenAPI contracts, ADRs and four CI workflows with real Postgres and RabbitMQ.',
    chips: ['Java 21', 'Spring Boot', 'RabbitMQ', 'PostgreSQL', 'Flyway', 'React', 'TypeScript'],
  },
  {
    file: 'sales-crm.svg', tag: 'PRIVATE · SOLO', title: 'Sales CRM + LMS Integration',
    desc: 'Commercial CRM for a training company: sales pipeline, renewals driven by certificate expiry, goals and scheduled e-mail reports.',
    mine: 'Sole author: TypeScript monorepo, typed contracts, REST sync with the LMS behind a feature flag — 172 commits.',
    chips: ['Node.js', 'Fastify', 'Kysely', 'MySQL', 'Zod', 'React', 'TanStack Query'],
  },
  {
    file: 'boitatech.svg', tag: 'PUBLIC · INOVATECH 2026 FINALIST', title: 'BoitaTech', link: true,
    desc: 'Environmental monitoring platform with 2D/3D geospatial maps, citizen reports with LGPD consent, recycling points and curated news.',
    mine: 'Finished 5th among the finalists. Includes hand-gesture map control powered by MediaPipe.',
    chips: ['Laravel', 'PostgreSQL', 'Leaflet', 'CesiumJS', 'MediaPipe', 'Tailwind'],
  },
  {
    file: 'event-api.svg', tag: 'PRIVATE · SOLO', title: 'Event Operations API',
    desc: 'Back-office API for sports events: SPA session auth, role-based access, races and categories, and a ticketing-platform integration.',
    mine: 'Queues on Redis/Horizon, static analysis with Larastan and PHPUnit feature tests.',
    chips: ['Laravel 13', 'Sanctum', 'PostgreSQL', 'Redis', 'Horizon', 'PHPUnit'],
  },
  {
    file: 'acesso-facil.svg', tag: 'PUBLIC · SOLO', title: 'Acesso Fácil', link: true,
    desc: 'Find and rate accessible places in Manaus: interactive map, analytics dashboard, reviews and VLibras sign-language support.',
    mine: 'Built for Inovatech: accessibility indicators, map clustering and charts on a Laravel + Breeze base.',
    chips: ['Laravel', 'MySQL', 'Leaflet', 'Chart.js', 'Tailwind', 'Alpine.js'],
  },
];

// Wide single-column cards: left = story, right = stack chips.
const CW = 840, SPLIT = 604, CX0 = SPLIT + 22, CX1 = CW - 24;
function layout(p) {
  const desc = wrap(p.desc, 64), mine = wrap(p.mine, 72);
  let y = 114;
  const descSvg = desc.map((l) => { const s = `<text x="32" y="${y}" fill="#C9D1D9" font-family="${SANS}" font-size="16">${esc(l)}</text>`; y += 23; return s; }).join('\n  ');
  y += 12;
  const arrowY = y;
  const mineSvg = mine.map((l) => { const s = `<text x="52" y="${y}" fill="${C.gray}" font-family="${SANS}" font-size="14">${esc(l)}</text>`; y += 20; return s; }).join('\n  ');
  let cx = CX0, cy = 62; const chips = [];
  for (const c of p.chips) {
    const w = Math.round(c.length * 7.6 + 24);
    if (cx + w > CX1) { cx = CX0; cy += 34; }
    chips.push(`<rect x="${cx}" y="${cy}" width="${w}" height="26" rx="13" fill="${C.panel}" stroke="#1E3A5F"/>
  <text x="${cx + w / 2}" y="${cy + 17.5}" text-anchor="middle" fill="${C.blue}" font-family="${MONO}" font-size="12.5">${esc(c)}</text>`);
    cx += w + 8;
  }
  return { descSvg, mineSvg, arrowY, chips, bottom: Math.max(y - 20 + 8, cy + 26) };
}
const CH = Math.max(...projects.map((p) => layout(p).bottom)) + 26;

for (const p of projects) {
  const W = CW, H = CH;
  const { descSvg, mineSvg, arrowY, chips } = layout(p);
  const corner = p.link
    ? `<text x="${SPLIT - 28}" y="46" text-anchor="end" fill="${C.blue}" font-family="${SANS}" font-size="22">↗</text>`
    : `<g transform="translate(${SPLIT - 46} 29)" fill="none" stroke="${C.gray}" stroke-width="1.6"><rect x="1" y="7" width="14" height="10" rx="2"/><path d="M4 7V5a4 4 0 0 1 8 0v2"/></g>`;
  const stackLabel = `<line x1="${SPLIT}" y1="24" x2="${SPLIT}" y2="${H - 24}" stroke="${C.line}"/>
  <text x="${CX0}" y="44" fill="${C.gray}" font-family="${MONO}" font-size="11.5" letter-spacing="1.2">STACK</text>`;
  save(join('projects', p.file), `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="t d">
  <title id="t">${esc(p.title)}</title>
  <desc id="d">${esc(p.desc)} ${esc(p.mine)} Stack: ${esc(p.chips.join(', '))}.</desc>
  <defs>${accentDef}</defs>
  <rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="14" fill="${C.bg}" stroke="${C.line}"/>
  <rect x="0" y="28" width="3" height="58" fill="url(#accent)"/>
  <text x="32" y="45" fill="${C.blue}" font-family="${MONO}" font-size="12" letter-spacing="1.2">${esc(p.tag)}</text>
  ${corner}
  ${stackLabel}
  <text x="32" y="80" fill="${C.white}" font-family="${SANS}" font-size="26" font-weight="700">${esc(p.title)}</text>
  ${descSvg}
  <text x="32" y="${arrowY}" fill="${C.blue}" font-family="${MONO}" font-size="14">→</text>
  ${mineSvg}
  ${chips.join('\n  ')}
</svg>`);
}
console.log('ok');
