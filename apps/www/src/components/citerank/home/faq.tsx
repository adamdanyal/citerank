import type { ReactNode } from "react";
import { externalRel } from "@/lib/external-link";
import type { FaqItem } from "@/lib/faqs";
import { Container, Eyebrow, QUIET_LINK, Reveal } from "../ui";

/** Every answer is open on the page, in two columns, so nothing is hidden behind a click. */
export function Faq({ items }: { items: FaqItem[] }) {
	return (
		<section className="bg-white">
			<Container className="py-20 lg:py-24">
				<Reveal className="max-w-[42.5rem]">
					<Eyebrow>FAQ</Eyebrow>
					<h2 className="heading-2 mt-4 text-zinc-950">Frequently Asked Questions</h2>
					<p className="body-7 mt-6 text-zinc-600">
						Something we didn't cover? Email us at{" "}
						<a href="mailto:team@citerank.com" className={`${QUIET_LINK} text-zinc-950`}>
							team@citerank.com
						</a>
						.
					</p>
				</Reveal>
				<dl className="mt-12 grid gap-x-12 gap-y-10 md:grid-cols-2 lg:mt-16">
					{items.map((item, index) => (
						<Reveal key={item.question} delay={(index % 2) * 80}>
							<dt className="title-2 text-zinc-950">{item.question}</dt>
							<dd className="body-3 mt-3 max-w-[60ch] text-zinc-600">
								<FaqAnswer item={item} />
							</dd>
						</Reveal>
					))}
				</dl>
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
