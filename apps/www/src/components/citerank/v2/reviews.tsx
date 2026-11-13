import { Popover, PopoverContent, PopoverTrigger } from "@workspace/ui/components/popover";
import { EngineIcon } from "@/components/home/engines";
import { AI_PROMPT, REVIEW_COLUMNS, type Review } from "../home/reviews";
import { BODY, LINK, MONO, PANEL, PANEL_PAD, Page, PanelHead, PILL_RUST, SMALL } from "./kit";

const ROW_ORDER = [0, 1, 2].flatMap((row) => REVIEW_COLUMNS.map((column) => column[row]));

type AiReview = Extract<Review, { kind: "ai" }>;

function Initials({ name }: { name: string }) {
	const letters = name
		.split(" ")
		.map((word) => word[0])
		.join("")
		.slice(0, 2);
	return (
		<span
			className={`${MONO} inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-paper ring-1 ring-zinc-200`}
		>
			{letters}
		</span>
	);
}

function Avatar({ review }: { review: Review }) {
	if (review.kind === "ai") {
		return (
			<span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-ink text-white">
				<EngineIcon iconId={review.iconId} className="size-5" />
			</span>
		);
	}
	if (!review.photo) return <Initials name={review.name} />;
	return (
		<img
			src={review.photo}
			alt=""
			width={40}
			height={40}
			loading="lazy"
			decoding="async"
			className="size-10 shrink-0 rounded-full object-cover"
		/>
	);
}

/* An AI's review sits on rust-tinted paper, because it is the product reviewing itself. */
function ReviewCard({ review }: { review: Review }) {
	const isAi = review.kind === "ai";
	return (
		<figure
			className={`rounded-2xl p-6 ring-1 sm:p-7 ${isAi ? "bg-blue-50 ring-rust/15" : "bg-paper-2 ring-zinc-200"}`}
		>
			{isAi ? (
				<p className="mb-5">
					<span className={PILL_RUST}>Asked {review.name}</span>
				</p>
			) : null}
			<blockquote className={`${BODY} text-ink`}>“{review.quote}”</blockquote>
			<figcaption className="mt-6 flex items-center gap-3">
				<Avatar review={review} />
				<div className="min-w-0 flex-1">
					<p className={`${SMALL} font-medium text-ink`}>{review.name}</p>
					{review.kind === "ai" ? (
						<AnswerDetails review={review} />
					) : review.role ? (
						<p className={`${SMALL} truncate text-zinc-600`}>{review.role}</p>
					) : null}
				</div>
				{isAi ? (
					<a
						href={review.askUrl}
						target="_blank"
						rel="noopener noreferrer"
						className={`${LINK} shrink-0 text-[0.9375rem] font-medium text-blue-800`}
					>
						Ask it<span className="sr-only"> ({review.name})</span>
					</a>
				) : null}
			</figcaption>
		</figure>
	);
}

function AnswerDetails({ review }: { review: AiReview }) {
	return (
		<Popover>
			<PopoverTrigger
				openOnHover
				delay={150}
				className={`${MONO} rounded-sm underline decoration-zinc-300 decoration-dotted underline-offset-4 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust`}
			>
				Asked Oct 31, 2026
			</PopoverTrigger>
			<PopoverContent align="start" className="w-[min(26rem,calc(100vw-2rem))] rounded-2xl border-zinc-200 p-5">
				<p className={MONO}>We asked {review.name}</p>
				<p className={`${SMALL} mt-2 rounded-xl bg-paper-2 p-3 text-zinc-700`}>{AI_PROMPT}</p>
				<p className={`${MONO} mt-4`}>Its full answer, Oct 31, 2026</p>
				<div
					className={`${SMALL} mt-2 max-h-44 space-y-2 overflow-y-auto overscroll-contain rounded-xl bg-paper-2 p-3 text-zinc-700`}
				>
					{review.response.map((paragraph) => (
						<p key={paragraph}>{paragraph}</p>
					))}
				</div>
				<p className={`${MONO} mt-4`}>Asked over the {review.name} API with web search. Answers vary.</p>
			</PopoverContent>
		</Popover>
	);
}

export function Reviews() {
	return (
		<section className={`${PANEL} ${PANEL_PAD}`}>
			<Page>
				<PanelHead title="Loved by marketers. Recommended by AI." className="max-w-[46rem]" />

				<div className="mt-12 grid gap-4 md:grid-cols-2 lg:hidden">
					{ROW_ORDER.map((review) => (
						<ReviewCard key={review.name} review={review} />
					))}
				</div>
				<div className="mt-12 hidden grid-cols-3 items-start gap-4 lg:grid">
					{REVIEW_COLUMNS.map((column) => (
						<div key={column[0].name} className="flex flex-col gap-4">
							{column.map((review) => (
								<ReviewCard key={review.name} review={review} />
							))}
						</div>
					))}
				</div>
			</Page>
		</section>
	);
}
