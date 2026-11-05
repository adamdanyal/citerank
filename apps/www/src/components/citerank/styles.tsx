const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const HEADING_FONT = '"Schibsted Grotesk", ui-sans-serif, system-ui, sans-serif';

/*
 * Named text styles: every piece of text on the redesigned pages uses one of
 * these, built from Tailwind's type scale, instead of loose size and weight
 * utilities. Motion classes sit with them so the page has one timing curve.
 */
const css = `
html { scroll-behavior: smooth; scroll-padding-top: 5rem; }

.heading-1, .heading-2, .heading-3, .heading-4, .heading-5, .heading-6 { font-family: ${HEADING_FONT}; font-weight: 600; text-wrap: balance; }
.heading-1 { font-size: 2.25rem; line-height: 2.5rem; letter-spacing: -0.03em; }
.heading-2 { font-size: 1.875rem; line-height: 2.25rem; letter-spacing: -0.03em; }
.heading-3 { font-size: 1.5rem; line-height: 2rem; letter-spacing: -0.025em; }
.heading-4 { font-size: 1.5rem; line-height: 2rem; letter-spacing: -0.02em; }
.heading-5 { font-size: 1.25rem; line-height: 1.75rem; letter-spacing: -0.02em; }
.heading-6 { font-size: 1.125rem; line-height: 1.75rem; letter-spacing: -0.015em; }
@media (min-width: 640px) {
  .heading-1 { font-size: 3rem; line-height: 1; }
  .heading-2 { font-size: 2.25rem; line-height: 2.5rem; }
  .heading-3 { font-size: 1.875rem; line-height: 2.25rem; }
}
@media (min-width: 768px) {
  .heading-1 { font-size: 3.75rem; line-height: 1; }
}
@media (min-width: 1024px) {
  .heading-1 { font-size: 4.5rem; line-height: 1; letter-spacing: -0.04em; }
  .heading-2 { font-size: 3rem; line-height: 1; }
  .heading-3 { font-size: 2.25rem; line-height: 2.5rem; }
  .heading-4 { font-size: 1.875rem; line-height: 2.25rem; }
  .heading-5 { font-size: 1.5rem; line-height: 2rem; }
  .heading-6 { font-size: 1.25rem; line-height: 1.75rem; }
}

.title-1 { font-size: 1.25rem; line-height: 1.75rem; font-weight: 500; }
.title-2 { font-size: 1.125rem; line-height: 1.75rem; font-weight: 500; }
.title-3 { font-size: 1rem; line-height: 1.5rem; font-weight: 500; }
.title-4 { font-size: 0.875rem; line-height: 1.25rem; font-weight: 500; }

.body-1 { font-size: 1rem; line-height: 1.5rem; font-weight: 600; text-wrap: pretty; }
.body-2 { font-size: 1rem; line-height: 1.5rem; font-weight: 500; text-wrap: pretty; }
.body-3 { font-size: 1rem; line-height: 1.5rem; font-weight: 400; text-wrap: pretty; }
.body-5 { font-size: 0.875rem; line-height: 1.25rem; font-weight: 500; text-wrap: pretty; }
.body-6 { font-size: 0.875rem; line-height: 1.25rem; font-weight: 400; text-wrap: pretty; }
.body-7 { font-size: 1.125rem; line-height: 1.75rem; font-weight: 400; text-wrap: pretty; }
.body-8 { font-size: 1.125rem; line-height: 1.75rem; font-weight: 400; text-wrap: pretty; }
@media (min-width: 768px) { .body-8 { font-size: 1.25rem; line-height: 1.75rem; } }

.button-md { font-size: 1rem; line-height: 1.5rem; font-weight: 600; }
.button-sm { font-size: 0.875rem; line-height: 1.25rem; font-weight: 600; }

.caption-1 { font-size: 0.875rem; line-height: 1.25rem; font-weight: 500; }
.caption-2 { font-size: 0.875rem; line-height: 1.25rem; font-weight: 400; }
.caption-3 { font-size: 0.75rem; line-height: 1rem; font-weight: 600; }
.caption-4 { font-size: 0.75rem; line-height: 1rem; font-weight: 500; }
.caption-5 { font-size: 0.75rem; line-height: 1rem; font-weight: 400; }

.cr-grain::before { content: ""; position: absolute; inset: 0; pointer-events: none; opacity: 0.06; mix-blend-mode: multiply; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); }

.cr-gradient-text { background-image: linear-gradient(to right, #1a1917, #5f594f); -webkit-background-clip: text; background-clip: text; color: transparent; padding-bottom: 0.08em; margin-bottom: -0.08em; }

.cr-reveal[data-state="hidden"] { opacity: 0; transform: translateY(32px); transition: none; }
.cr-reveal[data-state="shown"] { opacity: 1; transform: none; transition: opacity 700ms ${EASE}, transform 700ms ${EASE}; }

.cr-tagline[data-armed] .cr-word { color: rgb(26 25 23 / 0.28); transition: color 500ms ${EASE}; }
.cr-tagline[data-armed] .cr-word[data-on] { color: #1a1917; }

.cr-menu-link { opacity: 0; transform: translateY(24px); transition: opacity 400ms ${EASE}, transform 400ms ${EASE}; }
[data-menu="open"] .cr-menu-link { opacity: 1; transform: none; }

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  .cr-reveal[data-state="hidden"], .cr-reveal[data-state="shown"], .cr-menu-link, [data-menu="open"] .cr-menu-link { transform: none; transition: opacity 200ms ${EASE}; }
  .cr-tagline[data-armed] .cr-word { color: #1a1917; transition: none; }
}
`;

export function SiteStyles() {
	return <style>{css}</style>;
}
