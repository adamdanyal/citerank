import { Plus } from "lucide-react";
import type { ReactNode } from "react";
import { externalRel } from "@/lib/external-link";
import type { FaqItem } from "@/lib/faqs";
import { BODY, LINK, PANEL, PANEL_PAD, Page, PanelHead } from "./kit";

/*
 * Each answer opens under its question. The answers are in the page from the
 * start, so a crawler and the FAQPage schema read the same text a visitor does,
 * and they open without script.
 */
export function Faq({ items }: { items: FaqItem[] }) {
	return (
		<section id="questions" className={`${PANEL} ${PANEL_PAD}`}>
			<Page className="grid gap-10 lg:grid-cols-12 lg:gap-8">
				<div className="lg:sticky lg:top-28 lg:col-span-4 lg:self-start">
					<PanelHead title="Frequently asked questions">
						<p className={`${BODY} text-zinc-600`}>
							Something we didn’t cover? Email us at{" "}
							<a href="mailto:team@citerank.com" className={`${LINK} text-ink`}>
								team@citerank.com
							</a>
							.
						</p>
					</PanelHead>
				</div>
				<div className="border-b border-zinc-200 lg:col-span-8">
					{items.map((item) => (
						<details key={item.question} className="group border-t border-zinc-200">
							<summary className="flex cursor-pointer list-none items-start justify-between gap-6 rounded-sm py-6 text-[1.125rem] leading-[1.4] font-medium text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust [&::-webkit-details-marker]:hidden">
								{item.question}
								<Plus
									aria-hidden="true"
									className="mt-0.5 size-5 shrink-0 text-zinc-500 transition-transform duration-200 ease-out group-open:rotate-45"
								/>
							</summary>
							<p className={`${BODY} max-w-[66ch] pb-7 text-zinc-600`}>
								<Answer item={item} />
							</p>
						</details>
					))}
				</div>
			</Page>
		</section>
	);
}

/* Phrases listed on the item become links inside the answer, so the text stays one string. */
function Answer({ item }: { item: FaqItem }) {
	let parts: ReactNode[] = [item.answer];
	for (const link of item.links ?? []) {
		parts = parts.flatMap((part) => {
			if (typeof part !== "string" || !part.includes(link.text)) return [part];
			const [before, ...rest] = part.split(link.text);
			return [
				before,
				<a
					key={link.href}
					href={link.href}
					target="_blank"
					rel={externalRel(link.href)}
					className={`${LINK} text-ink ${link.text.length <= 24 ? "whitespace-nowrap" : ""}`}
				>
					{link.text}
				</a>,
				rest.join(link.text),
			];
		});
	}
	return <>{parts}</>;
}
