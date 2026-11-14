# Design: CiteRank.com marketing site

The locked system. Every Hallmark run reads this first and pages share it. Change it on purpose; the file is the rule.

## System

- Genre: modern-minimal
- Shape of the first page: Stat-Led
- Theme: brand (rust, ink and warm paper; Schibsted Grotesk over Inter)
- Axes: light/grotesk-sans/warm · posture: Restrained

## Tokens

`src/styles.css` holds them in its `@theme` block, on the project's own names. The roles:

```css
--color-paper: #fbfaf9;  --color-paper-2: #f4f3f0;  --color-paper-3: #ebe8e1;
--color-ink: #1a1917;  /* secondary text */ --color-zinc-700: #47423a;  /* muted */ --color-zinc-600: #5f594f;
/* rule */ --color-zinc-200: #e7e3dc;
/* on the ink bands */ --color-ink-well: #262420;  --color-ink-rule: #3a3731;
/* accent */ --color-rust: #b84d25;  /* its text */ --color-paper;  /* focus */ --color-rust;
--font-display: "Schibsted Grotesk";  --font-body: "Inter";  /* outlier, code and measured figures only */ "JetBrains Mono";
--radius-card: 12px;  /* pill */ 999px;  /* rule */ 1px;  --shadow-card: one 1px shadow, menus only;
--text-display: 84px;  --text-display-s: 60px;  --text-section: 52px;  --text-title: 25px;  --text-lead: 21px;  /* at 1440 */
```

Body is 16px and labels 14px. The container is 1440px with 64px gutters (24px under 60rem, 16px under 40rem). Sections part by 120, 144 or 176px; a band takes 120px either side.

## Controls

- Primary: rust fill, paper text · pill · 52px (44px in the nav)
- Secondary: 1px outline · same radius and height

## Motion

- Character: still. No reveals; colour changes take 200ms; the pinned screens move only with the scroll.

## Page rules

- Every section runs the full width. A change of paper, tinted or ink, is a band. No rounded page panels and no card inside a card.
- Three weights: 400 for body, 500 for labels and controls, 700 for display.
- Labels are the body face in sentence case. Mono is for code and measured figures.
- The sign-up action reads "Start tracking" wherever it appears.
- hero: Stage on `/`, Banner on every other page · nav: three-part bar on ink · footer: index columns on ink

## The product

- The site shows no screenshot of the product and no frame around it. Wherever the product appears it is HTML, from `src/components/citerank/product`, fed by the live demo's sample data in `src/data/product-preview.json` (`scripts/demo-data/export-preview.ts` writes it).
- A screen that stands on its own works: tabs change the screen, the four figures change the chart and the table, filters filter, the chart has a cursor. Inside a link it is drawn still, and cut to one height with a fade.
- Inside a screen the product keeps its own labels, in its own title case, and its own colours: `--color-chart-1` to `-9` for brands on a chart, `--color-mark-1` to `-9` for their marks, and `--color-good`, `--color-warn` and `--color-bad` for the tone of an answer. Those colours appear nowhere else on the site.
- Controls inside a screen stand 36 to 44px, as they do in the app.
- Every screen says it is sample data and links to the same screen in the live demo.

## Exports

The tokens are in `src/styles.css`; the class recipes built from them are in `src/components/citerank/v2/kit.tsx`.
