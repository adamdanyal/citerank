import { Container, QUIET_LINK, Reveal } from "../ui";

export function Support() {
	return (
		<section className="bg-white">
			<Container className="py-20 lg:py-24">
				<Reveal className="max-w-3xl">
					<h2 className="heading-2 text-zinc-950">Questions Answered by the People Who Built It</h2>
					<p className="body-8 mt-6 text-zinc-700">
						There is no support tier and no ticket queue. Email{" "}
						<a href="mailto:team@citerank.com" className={`${QUIET_LINK} text-zinc-950`}>
							team@citerank.com
						</a>{" "}
						or use the chat in the corner of any page, and the team that runs CiteRank.com answers.
					</p>
					<p className="body-7 mt-4 text-zinc-600">
						CiteRank.com is a trading name of Danx Digital Limited, a company registered in England and Wales.
					</p>
				</Reveal>
			</Container>
		</section>
	);
}
