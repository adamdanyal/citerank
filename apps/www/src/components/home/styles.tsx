/**
 * Scopes the homepage's body face. Popovers and dialogs portal out of the page
 * wrapper, so they take the class too.
 */
export const HOME_FONT_CLASS = "home-font";

// Entrance motion only: the static end state is the design, which is what a
// screenshot, a crawler, or a reduced-motion visitor gets.
const css = `
.${HOME_FONT_CLASS} { --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif; font-family: var(--font-sans); }
@keyframes home-rise { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
@keyframes home-grow { from { transform: scaleX(0); } }
.home-rise { animation: home-rise 700ms cubic-bezier(0.2, 0.7, 0.2, 1) both; animation-delay: var(--d, 0ms); }
.home-grow { transform-origin: left; animation: home-grow 900ms cubic-bezier(0.3, 0.7, 0.2, 1) both; animation-delay: var(--d, 0ms); }
@media (prefers-reduced-motion: reduce) { .home-rise, .home-grow { animation: none; } }
`;

export function HomeStyles() {
	return <style>{css}</style>;
}

/** Staggers an entrance by `ms`, for elements carrying home-rise or home-grow. */
export function delay(ms: number): React.CSSProperties {
	return { "--d": `${ms}ms` } as React.CSSProperties;
}
