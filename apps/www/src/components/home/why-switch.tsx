const FACTS = [
	{
		lead: "Ten AI Apps",
		rest: "ChatGPT, Claude, Gemini, Perplexity, Copilot, Grok, DeepSeek, Mistral and Google's two.",
	},
	{ lead: "Up to 4× a Day", rest: "Each question is asked up to four times a day in every AI app you pick." },
	{ lead: "Every Answer Kept", rest: "Read the full answer behind every number." },
	{ lead: "Unlimited Seats", rest: "For your whole team on every plan." },
	{ lead: "API and MCP", rest: "Pull your data into your own reports and AI agents." },
];

export function WhySwitch() {
	return (
		<section aria-labelledby="why-switch" className="border-t border-zinc-200/80 bg-zinc-50/70">
			<div className="mx-auto max-w-6xl px-4 py-16 md:px-6 lg:py-20">
				<h2
					id="why-switch"
					className="text-center text-2xl font-semibold tracking-[-0.025em] text-zinc-950 md:text-3xl"
				>
					What Every Plan Includes
				</h2>
				<ul className="mt-10 grid gap-px overflow-hidden rounded-2xl bg-zinc-200/80 ring-1 ring-zinc-200/80 sm:grid-cols-2 lg:grid-cols-5">
					{FACTS.map((f) => (
						<li key={f.lead} className="bg-white p-6">
							<p className="text-xl font-semibold tracking-[-0.02em] text-zinc-950">{f.lead}</p>
							<p className="mt-1 text-pretty text-sm/6 text-zinc-600">{f.rest}</p>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}
