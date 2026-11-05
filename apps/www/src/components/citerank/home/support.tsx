import { Mail, MessageCircle } from "lucide-react";
import { CARD, Container, ICON_BOX, QUIET_LINK, Reveal } from "../ui";

export function Support() {
	return (
		<section className="bg-white">
			<Container className="py-20 lg:py-24">
				<Reveal className="mx-auto max-w-3xl text-center">
					<h2 className="heading-2 text-zinc-950">Questions Answered by the People Who Built It</h2>
					<p className="body-8 mt-6 text-zinc-700">
						No support tiers and no ticket queue. The team that runs CiteRank.com answers, by email or chat.
					</p>
				</Reveal>
				<div className="mx-auto mt-12 grid max-w-3xl gap-5 sm:grid-cols-2">
					<Reveal className={`${CARD} p-6`}>
						<span className={ICON_BOX}>
							<Mail className="size-5" aria-hidden="true" />
						</span>
						<h3 className="title-1 mt-6 text-zinc-950">Email</h3>
						<p className="body-6 mt-2 text-zinc-600">
							Write to{" "}
							<a href="mailto:team@citerank.com" className={`${QUIET_LINK} text-zinc-950`}>
								team@citerank.com
							</a>{" "}
							with a question, a bug or a feature you need.
						</p>
					</Reveal>
					<Reveal delay={60} className={`${CARD} p-6`}>
						<span className={ICON_BOX}>
							<MessageCircle className="size-5" aria-hidden="true" />
						</span>
						<h3 className="title-1 mt-6 text-zinc-950">Chat</h3>
						<p className="body-6 mt-2 text-zinc-600">
							Use the chat in the corner of any page, on the site and inside the product.
						</p>
					</Reveal>
				</div>
				<p className="caption-2 mt-8 text-center text-zinc-500">
					CiteRank.com is a trading name of Danx Digital Limited, a company registered in England and Wales.
				</p>
			</Container>
		</section>
	);
}
