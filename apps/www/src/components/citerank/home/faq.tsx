import type { ReactNode } from "react";
import { externalRel } from "@/lib/external-link";
import type { FaqItem } from "@/lib/faqs";
import { CARD, Container, QUIET_LINK, Reveal } from "../ui";

/** Answers are always open: nothing to click for a reader, and plain text for crawlers and the FAQPage JSON-LD. */
export function Faq({ items }: { items: FaqItem[] }) {
	return (
		<section className="bg-paper-2">
			<Container className="grid gap-10 py-20 lg:grid-cols-12 lg:gap-16 lg:py-24">
				<Reveal className="lg:sticky lg:top-24 lg:col-span-4 lg:self-start">
					<h2 className="heading-2 text-zinc-950">Frequently Asked Questions</h2>
					<p className="body-6 mt-6 text-zinc-600">
						Something we didn't cover? Email us at{" "}
						<a href="mailto:team@citerank.com" className={`${QUIET_LINK} text-zinc-950`}>
							team@citerank.com
						</a>
						.
					</p>
				</Reveal>
				<Reveal delay={100} className={`${CARD} divide-y divide-zinc-200/80 px-6 lg:col-span-8 lg:px-8`}>
					{items.map((item) => (
						<div key={item.question} className="py-6">
							<h3 className="title-3 text-zinc-950">{item.question}</h3>
							<p className="body-6 mt-2 max-w-[65ch] text-zinc-600">
								<FaqAnswer item={item} />
							</p>
						</div>
					))}
				</Reveal>
			</Container>
		</section>
	);
}

function FaqAnswer({ item }: { item: FaqItem }) {
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
					className={`${QUIET_LINK} text-zinc-950`}
				>
					{link.text}
				</a>,
				rest.join(link.text),
			];
		});
	}
	return <>{parts}</>;
}
