import { Link } from "@tanstack/react-router";
import { CLOUD_ENTRY_PRICE_USD } from "@workspace/config/plans";
import { trackAdConversion } from "@workspace/ui/lib/ad-tags";
import { type FormEvent, type RefObject, useEffect, useId, useRef, useState } from "react";
import { AGENCY_FROM_USD, formatUsd } from "@/lib/agency-plans";
import { embedInlineBooking } from "@/lib/cal-embed";
import { trackEvent } from "@/lib/posthog";
import { ACTION, CARD, CARD_LIFT, FOCUS, LINK, SMALL, SUBHEAD } from "./kit";

const CAL_LINK = "citerank/30mins";

const SIZES = ["1 to 10", "11 to 50", "51 to 200", "201 to 1,000", "More than 1,000"] as const;
const PRICE_FITS = ["Yes", "Maybe, once I see results", "No"] as const;
const STEP_COUNT = 3;

const CHOICE = `flex min-h-13 w-full items-center rounded-full px-6 py-3 text-left text-[1rem] leading-snug font-medium ring-1 ring-inset transition-colors duration-200 active:translate-y-px ${FOCUS}`;
const CHOICE_OFF = "bg-white text-ink ring-zinc-400 hover:ring-ink";
const CHOICE_ON = "bg-ink text-paper ring-ink";

/* A typed website is accepted with or without its scheme, as long as it has a dot and no spaces. */
const WEBSITE = /^(https?:\/\/)?[^\s/.]+(\.[^\s/.]+)+(\/\S*)?$/i;

interface Answers {
	website: string;
	size: string;
	price: string;
}

function Calendar({ answers }: { answers: Answers }) {
	const booker = useRef<HTMLDivElement>(null);
	useEffect(() => {
		if (!booker.current) return;
		embedInlineBooking({
			element: booker.current,
			calLink: CAL_LINK,
			params: {
				notes: [
					`Website: ${answers.website.trim()}`,
					`Company size: ${answers.size}`,
					`Starting price of ${formatUsd(AGENCY_FROM_USD)} a month works: ${answers.price}`,
				].join("\n"),
				// The same answers as booking metadata, which Cal.com keeps whether or not the event shows its notes field.
				"metadata[website]": answers.website.trim(),
				"metadata[companySize]": answers.size,
				"metadata[priceWorks]": answers.price,
			},
			onBooked: (uid) => trackAdConversion("demo_booked", { id: uid }),
		});
		trackEvent("agency_call_calendar", { price: answers.price });
	}, [answers]);
	return <div ref={booker} className={`${CARD_LIFT} min-h-[640px] w-full overflow-auto`} />;
}

function TrackerOffer({ heading, onBook }: { heading: RefObject<HTMLHeadingElement | null>; onBook: () => void }) {
	return (
		<div className={`${CARD} max-w-2xl`}>
			<h3 ref={heading} tabIndex={-1} className={`${SUBHEAD} text-ink focus:outline-none`}>
				The tracker starts at ${CLOUD_ENTRY_PRICE_USD} a month
			</h3>
			<p className="mt-3 text-[1rem] leading-[1.6] text-zinc-600">
				It shows what AI says about your brand and ranks what to fix, so your team can do the work.
			</p>
			<p className="mt-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
				<Link to="/pricing" className={ACTION}>
					See tracker plans
				</Link>
				<button type="button" onClick={onBook} className={`${LINK} ${SMALL} font-medium text-ink`}>
					Book a call anyway
				</button>
			</p>
		</div>
	);
}

function WebsiteQuestion({
	value,
	onChange,
	onNext,
	input,
}: {
	value: string;
	onChange: (value: string) => void;
	onNext: () => void;
	input: RefObject<HTMLInputElement | null>;
}) {
	const id = useId();
	const [error, setError] = useState("");
	function submit(event: FormEvent) {
		event.preventDefault();
		if (!WEBSITE.test(value.trim())) {
			setError("Enter your website, like yourbrand.com.");
			input.current?.focus();
			return;
		}
		onNext();
	}
	return (
		<form noValidate onSubmit={submit} className="mt-4">
			<label htmlFor={`${id}-website`} className={`${SUBHEAD} block text-ink`}>
				What’s your website?
			</label>
			<div className="mt-5 flex flex-col gap-3 sm:flex-row">
				<input
					ref={input}
					id={`${id}-website`}
					type="text"
					inputMode="url"
					autoComplete="url"
					autoCapitalize="none"
					spellCheck={false}
					placeholder="yourbrand.com"
					value={value}
					onChange={(event) => {
						onChange(event.target.value);
						setError("");
					}}
					aria-invalid={error ? true : undefined}
					aria-describedby={error ? `${id}-error` : undefined}
					className={`h-13 w-full min-w-0 rounded-full bg-white sm:w-auto sm:flex-1 px-6 text-[1rem] text-ink ring-1 ring-inset transition-colors duration-200 placeholder:text-zinc-500 hover:bg-paper-2 ${error ? "ring-rust" : "ring-zinc-500"} ${FOCUS}`}
				/>
				<button type="submit" className={ACTION}>
					Next
				</button>
			</div>
			{error ? (
				<p id={`${id}-error`} className={`${SMALL} mt-3 font-medium text-rust`}>
					{error}
				</p>
			) : null}
		</form>
	);
}

function ChoiceQuestion({
	question,
	options,
	picked,
	onPick,
	heading,
}: {
	question: string;
	options: readonly string[];
	picked: string;
	onPick: (option: string) => void;
	heading: RefObject<HTMLHeadingElement | null>;
}) {
	const id = useId();
	return (
		<fieldset className="mt-4" aria-labelledby={id}>
			<h3 id={id} ref={heading} tabIndex={-1} className={`${SUBHEAD} text-ink focus:outline-none`}>
				{question}
			</h3>
			<ul className="mt-5 grid grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-2">
				{options.map((option) => (
					<li key={option}>
						<button
							type="button"
							aria-pressed={picked === option}
							onClick={() => onPick(option)}
							className={`${CHOICE} ${picked === option ? CHOICE_ON : CHOICE_OFF}`}
						>
							{option}
						</button>
					</li>
				))}
			</ul>
		</fieldset>
	);
}

/**
 * Three questions, one at a time, then the founders' calendar. Cal.com asks for
 * the name and email itself, so the form does not; the answers ride with the
 * booking as its notes and its metadata. A price that does not work is offered
 * the tracker instead, with the calendar still a click away.
 */
export function BookingForm() {
	const [index, setIndex] = useState(0);
	const [answers, setAnswers] = useState<Answers>({ website: "", size: "", price: "" });
	const [phase, setPhase] = useState<"questions" | "tracker" | "calendar">("questions");
	const moved = useRef(false);
	const heading = useRef<HTMLHeadingElement>(null);
	const input = useRef<HTMLInputElement>(null);

	// Focus follows the question once the visitor has answered one, never on page load.
	useEffect(() => {
		if (!moved.current) return;
		if (phase === "questions" && index === 0) input.current?.focus();
		else heading.current?.focus();
	}, [index, phase]);

	function go(next: number) {
		moved.current = true;
		setIndex(next);
	}

	if (phase === "calendar") return <Calendar answers={answers} />;
	if (phase === "tracker") return <TrackerOffer heading={heading} onBook={() => setPhase("calendar")} />;

	return (
		<div className={`${CARD} max-w-2xl`}>
			<p className={`${SMALL} flex items-center justify-between gap-4 text-zinc-600`}>
				<span>
					Question {index + 1} of {STEP_COUNT}
				</span>
				{index > 0 ? (
					<button type="button" onClick={() => go(index - 1)} className={`${LINK} font-medium text-ink`}>
						Back
					</button>
				) : null}
			</p>
			{index === 0 ? (
				<WebsiteQuestion
					value={answers.website}
					onChange={(website) => setAnswers({ ...answers, website })}
					onNext={() => go(1)}
					input={input}
				/>
			) : index === 1 ? (
				<ChoiceQuestion
					question="How many people work at your company?"
					options={SIZES}
					picked={answers.size}
					onPick={(size) => {
						setAnswers({ ...answers, size });
						go(2);
					}}
					heading={heading}
				/>
			) : (
				<ChoiceQuestion
					question={`The agency starts at ${formatUsd(AGENCY_FROM_USD)} a month. Does that work for you?`}
					options={PRICE_FITS}
					picked={answers.price}
					onPick={(price) => {
						setAnswers({ ...answers, price });
						moved.current = true;
						setPhase(price === "No" ? "tracker" : "calendar");
					}}
					heading={heading}
				/>
			)}
		</div>
	);
}
