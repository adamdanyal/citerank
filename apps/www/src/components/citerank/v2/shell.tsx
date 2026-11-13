import type { ReactNode } from "react";
import { PRIMARY_BUTTON } from "@/components/citerank/ui";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { DISPLAY, LEAD, PANEL, PANEL_PAD, Page } from "./kit";

/*
 * The page shell every marketing page shares: warm paper behind a stack of
 * panels, the floating nav above it, and the same gap under the nav that the
 * panels keep from each other.
 */
export function PageShell({ children }: { children: ReactNode }) {
	return (
		<div className="cr-v2 min-h-screen bg-paper-2 antialiased">
			<a
				href="#content"
				className={`${PRIMARY_BUTTON} sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50`}
			>
				Skip to content
			</a>
			<Navbar />
			<main
				id="content"
				className="mx-auto w-full max-w-[1400px] space-y-3 px-3 pt-3 pb-3 sm:px-4 sm:pt-4 sm:pb-4 md:space-y-4 md:px-5 md:pt-5 md:pb-5"
			>
				{children}
			</main>
			<Footer />
		</div>
	);
}

/** An inner page's opening panel: the rust rule, the h1, and one sentence under it. */
export function PageHead({ title, lede, children }: { title: string; lede?: ReactNode; children?: ReactNode }) {
	return (
		<section className={`${PANEL} ${PANEL_PAD}`}>
			<Page>
				<div aria-hidden="true" className="h-[3px] w-14 bg-rust" />
				<h1 className={`${DISPLAY} mt-7 max-w-[20ch] text-ink`}>{title}</h1>
				{lede ? (
					<p data-speakable className={`${LEAD} mt-6 max-w-[62ch] text-zinc-600`}>
						{lede}
					</p>
				) : null}
				{children ? <div className="mt-9">{children}</div> : null}
			</Page>
		</section>
	);
}

/** A plain panel for a page's other sections, so nothing on an inner page is boxed twice. */
export function PanelSection({ children, id }: { children: ReactNode; id?: string }) {
	return (
		<section id={id} className={`${PANEL} ${PANEL_PAD}`}>
			<Page>{children}</Page>
		</section>
	);
}
