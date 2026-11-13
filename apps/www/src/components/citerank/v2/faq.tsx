import type { ReactNode } from "react";
import { externalRel } from "@/lib/external-link";
import type { FaqItem } from "@/lib/faqs";
import { BODY, HEADING, LINK, Page, SECTION, SUBHEAD } from "./kit";

/** Answers stay open: nothing to click, and the same text crawlers and the FAQPage JSON-LD read. */
export function Faq({ items }: { items: FaqItem[] }) {
	return (
		<section className={`${SECTION} bg-white`}>
			<Page className="grid gap-12 lg:grid-cols-12 lg:gap-16">
				<div className="lg:sticky lg:top-28 lg:col-span-4 lg:self-start">
					<h2 className={`${HEADING} text-ink`}>Frequently asked questions</h2>
					<p className={`${BODY} mt-6 text-zinc-600`}>
						Something we didn't cover? Email us at{" "}
						<a href="mailto:team@citerank.com" className={`${LINK} text-ink`}>
							team@citerank.com
						</a>
						.
					</p>
				</div>
				<dl className="border-t border-zinc-200 lg:col-span-8">
					{items.map((item) => (
						<div key={item.question} className="border-b border-zinc-200 py-7">
							<dt className={`${SUBHEAD} text-ink`}>{item.question}</dt>
							<dd className={`${BODY} mt-3 max-w-[66ch] text-zinc-600`}>
								<Answer item={item} />
							</dd>
						</div>
					))}
				</dl>
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
				<a key={link.href} href={link.href} target="_blank" rel={externalRel(link.href)} className={`${LINK} text-ink`}>
					{link.text}
				</a>,
				rest.join(link.text),
			];
		});
	}
	return <>{parts}</>;
}
