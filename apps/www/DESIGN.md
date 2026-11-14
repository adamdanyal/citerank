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
--radius-card: 12px;  /* pill */ 999px;  /* rule */ 1px;  --shadow-card: one 1px shadow, menus only;  --shadow-lift: cards on a white section;
--text-display: 84px;  --text-display-s: 60px;  --text-section: 52px;  --text-title: 25px;  --text-lead: 21px;  /* at 1440 */
```

Body is 16px and labels 14px. The container is 1440px with 64px gutters (24px under 60rem, 16px under 40rem). Sections part by 120, 144 or 176px; a band takes 120px either side.

## Controls

- Primary: rust fill, paper text · pill · 52px (44px in the nav)
- Secondary: 1px outline · same radius and height

## Motion

- Character: still. No reveals; colour changes take 200ms; the pinned screens move only with the scroll.

## Page rules

- The owner's rule comes first: a ten-year-old can follow every section. One picture or one list, large type, and nothing to operate before the point is clear.
- Under the hero a section is white, and what it shows sits on white cards lifted by `--shadow-lift`: a picture, a list of the apps, a plan. Two panels on the page are ink: the agency's, and the call to action that ends it. No card inside a card.
- Tried and taken out on the owner's word, so not to be tried again without asking: every section on ink, a grid of coloured tiles holding product panels, and flat pale sections of ruled text.
- A thing you get is marked with the rust tick (`Tick` in the kit). The plan to pick stands under a rust band.
- A list sits on one lifted card, its rows parted by hairlines (`LIST_CARD`). Steps in order open on the numbered rust disc, as rows on one card or a card each (`StepRows`, `StepCards`), never a bare numeral. Places to go next are lifted cards that are each one link (`LinkCards`). An index of many short links runs down columns on one card (`INDEX_CARD`).
- A comparison table stays a flat ruled table on the page: its head pins under the nav and its first column pins on a phone, and a card would clip both.
- Three weights: 400 for body, 500 for labels and controls, 700 for display.
- Labels are the body face in sentence case. Mono is for code and measured figures.
- The sign-up action reads "Start tracking" wherever it appears.
- The sign-up action is in the header at every width from 350px. Nothing follows the visitor down the page: no bar fixed to the bottom of a phone.
- A link in text has a dotted underline, and on hover only its colour changes, to rust (`LINK` in the kit; on ink, `LINK_ON_INK`). A row or card that is one link changes its title's colour the same way and takes no underline.
- A section head of three or four words stays on one line on a phone: `--text-section` gives way to the screen's width under 480px.
- A sentence under a head takes one line where the screen allows, and never more than two. A ticked line takes one line on any phone; where it would not fit, the type gives way first.
- A ticked list is the body face at `--text-lead`, not the display face.
- Under a row of buttons that fills the width, the small line is centred. Beside a column of text it aligns with the buttons.
- An FAQ answer is three short sentences of 205 to 232 characters, about forty words: the answer first, then two facts behind it. Every answer on a page is the same size (three lines from a tablet up), and they all stand open.
- On the about page a person is credited under their portrait: name, role, then the LinkedIn mark with the follower count. Beside a quote the credit is one row: a round picture, then the name and LinkedIn on a line with the role and company under them.
- A page closes on a quote from each founder, on two cards of one size, then one ink panel with a head, a line and the two actions (`Closing`). The two quotes are the same length, name the company and state something a reader can check, and are set in the body face at normal weight. Blog posts and every index end the same way. The about page already tells the founders' story and shows the panel alone; the agency page ends on its booking band; support, the policies and the docs end without one.
- Where the AI apps are listed, each logo is drawn in its own colours (`--color-logo-*`). Those colours appear nowhere else.
- hero: Stage on `/`, Banner on every other page · nav: three-part bar on ink · footer: index columns on ink

## The product

- The site shows no screenshot of the product and no frame around it. Wherever the product appears it is HTML, from `src/components/citerank/product`, fed by the live demo's sample data in `src/data/product-preview.json` (`scripts/demo-data/export-preview.ts` writes it).
- A screen that stands on its own works: tabs change the screen, the four figures change the chart and the table, filters filter, the chart has a cursor. Inside a link it is drawn still, and cut to one height with a fade.
- Inside a screen the product keeps its own labels, in its own title case, and its own colours: `--color-chart-1` to `-9` for brands on a chart, `--color-mark-1` to `-9` for their marks, and `--color-good`, `--color-warn` and `--color-bad` for the tone of an answer. Those colours appear nowhere else on the site.
- Controls inside a screen stand 36 to 44px, as they do in the app.
- Every screen says it is sample data and links to the same screen in the live demo.

## Exports

The tokens are in `src/styles.css`; the class recipes built from them are in `src/components/citerank/v2/kit.tsx`.
