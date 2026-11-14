import type { ReactNode } from "react";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { ACTION_SM, DISPLAY, LEAD, PANEL, PANEL_PAD, Page } from "./kit";

export const SKIP_LINK = `${ACTION_SM} sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50`;

/* The shell every marketing page shares: the ink bar, full-width sections on warm paper, the footer. */
export function PageShell({ children }: { children: ReactNode }) {
	return (
		<div className="cr-v2 min-h-screen bg-paper antialiased">
			<a href="#content" className={SKIP_LINK}>
				Skip to content
			</a>
			<Navbar />
			<main id="content">{children}</main>
			<Footer />
		</div>
	);
}

/** An inner page's opening: the h1 and one sentence under it. */
export function PageHead({ title, lede, children }: { title: string; lede?: ReactNode; children?: ReactNode }) {
	return (
		<section className={`${PANEL} pt-12 pb-9 sm:pt-16 sm:pb-12 lg:pt-24 lg:pb-18`}>
			<Page>
				<h1 className={`${DISPLAY} max-w-[18ch] text-ink`}>{title}</h1>
				{lede ? (
					<p data-speakable className={`${LEAD} mt-6 max-w-[56ch] text-zinc-600`}>
						{lede}
					</p>
				) : null}
				{children ? <div className="mt-9">{children}</div> : null}
			</Page>
		</section>
	);
}

/** A plain section for a page's other content. */
export function PanelSection({ children, id }: { children: ReactNode; id?: string }) {
	return (
		<section id={id} className={`${PANEL} ${PANEL_PAD}`}>
			<Page>{children}</Page>
		</section>
	);
}
