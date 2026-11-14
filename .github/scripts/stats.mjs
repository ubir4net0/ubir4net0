// Generates dist/stats.svg from the public contribution calendar.
// Runs in GitHub Actions with the default GITHUB_TOKEN (no personal token).
// Usage: node .github/scripts/stats.mjs <outDir>
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const outDir = process.argv[2] || 'dist';
const user = process.env.GH_USER;
const token = process.env.GITHUB_TOKEN;
if (!user || !token) throw new Error('GH_USER and GITHUB_TOKEN are required');

const query = `query($login:String!){
  user(login:$login){
    contributionsCollection{
      contributionCalendar{ totalContributions weeks{ contributionDays{ date contributionCount } } }
    }
  }
}`;

const res = await fetch('https://api.github.com/graphql', {
  method: 'POST',
  headers: { Authorization: `bearer ${token}`, 'Content-Type': 'application/json', 'User-Agent': 'profile-stats' },
  body: JSON.stringify({ query, variables: { login: user } }),
});
if (!res.ok) throw new Error(`GitHub API ${res.status}`);
const json = await res.json();
if (json.errors) throw new Error(JSON.stringify(json.errors));

const cal = json.data.user.contributionsCollection.contributionCalendar;
const days = cal.weeks.flatMap((w) => w.contributionDays).sort((a, b) => a.date.localeCompare(b.date));

// Streaks. The current streak may end yesterday (today can still be empty).
let longest = 0, run = 0;
for (const d of days) { run = d.contributionCount > 0 ? run + 1 : 0; longest = Math.max(longest, run); }
let current = 0;
let i = days.length - 1;
if (i >= 0 && days[i].contributionCount === 0) i--;
for (; i >= 0 && days[i].contributionCount > 0; i--) current++;
const activeDays = days.filter((d) => d.contributionCount > 0).length;
const best = days.reduce((m, d) => (d.contributionCount > m.contributionCount ? d : m), days[0]);

const fmt = (n) => n.toLocaleString('en-US');
const updated = new Date().toISOString().slice(0, 10);

const kpis = [
  { value: fmt(cal.totalContributions), label: 'Contributions', sub: 'last 12 months' },
  { value: fmt(activeDays), label: 'Active days', sub: 'last 12 months' },
  { value: fmt(current), label: 'Current streak', sub: current === 1 ? 'day' : 'days' },
  { value: fmt(longest), label: 'Longest streak', sub: 'days · last 12 months' },
];

const W = 840, H = 190, colW = (W - 48) / kpis.length;
const font = "'Segoe UI', Inter, -apple-system, BlinkMacSystemFont, Helvetica, Arial, sans-serif";
const mono = "'JetBrains Mono', 'Cascadia Code', Consolas, 'SFMono-Regular', Menlo, monospace";

const cols = kpis.map((k, n) => {
  const x = 24 + n * colW;
  const divider = n > 0 ? `<line x1="${x}" y1="70" x2="${x}" y2="160" stroke="#21262D"/>` : '';
  return `${divider}
  <text x="${x + 20}" y="118" fill="#F0F6FC" font-family="${font}" font-size="38" font-weight="700">${k.value}</text>
  <text x="${x + 20}" y="142" fill="#00BFFF" font-family="${font}" font-size="14" font-weight="600">${k.label}</text>
  <text x="${x + 20}" y="160" fill="#8B949E" font-family="${font}" font-size="12">${k.sub}</text>`;
}).join('\n');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="t d">
  <title id="t">GitHub activity for ${user}</title>
  <desc id="d">${fmt(cal.totalContributions)} contributions and ${activeDays} active days in the last 12 months; current streak ${current} days; longest streak ${longest} days. Busiest day ${best.date} with ${best.contributionCount} contributions.</desc>
  <defs>
    <linearGradient id="accent" x1="0" x2="1"><stop offset="0" stop-color="#2563EB"/><stop offset="1" stop-color="#00BFFF"/></linearGradient>
  </defs>
  <rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="14" fill="#0D1117" stroke="#21262D"/>
  <rect x="24" y="24" width="3" height="18" rx="1.5" fill="url(#accent)"/>
  <text x="36" y="39" fill="#F0F6FC" font-family="${font}" font-size="16" font-weight="600">GitHub activity</text>
  <text x="${W - 24}" y="39" text-anchor="end" fill="#8B949E" font-family="${mono}" font-size="12">updated ${updated} · public + private contributions</text>
  ${cols}
</svg>
`;

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'stats.svg'), svg);
console.log(`stats.svg: total=${cal.totalContributions} active=${activeDays} current=${current} longest=${longest}`);
