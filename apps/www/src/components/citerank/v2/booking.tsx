import { Link } from "@tanstack/react-router";
import { CLOUD_ENTRY_PRICE_USD } from "@workspace/config/plans";
import { trackAdConversion } from "@workspace/ui/lib/ad-tags";
import { CornerDownLeft, X } from "lucide-react";
import { type KeyboardEvent, type ReactNode, type RefObject, useEffect, useId, useRef, useState } from "react";
import { AGENCY_FROM_USD, formatUsd } from "@/lib/agency-plans";
import { embedInlineBooking } from "@/lib/cal-embed";
import { trackEvent } from "@/lib/posthog";
import { ACTION, CARD_LIFT, FOCUS, LINK, SMALL } from "./kit";

const CAL_LINK = "citerank/30mins";
const CONTACT_EMAIL = "team@citerank.com";

const SIZES = ["1 to 10", "11 to 50", "51 to 200", "201 to 1,000", "More than 1,000"] as const;
const PRICE_FITS = ["Yes", "No"] as const;
const LETTERS = "ABCDE";
const STEP_COUNT = 3;

const QUESTION =
	"block font-heading text-[clamp(1.75rem,1.5vw+1.25rem,2.5rem)] leading-[1.15] font-bold tracking-[-0.01em] text-balance text-ink focus:outline-none";
const CHOICE = `flex min-h-13 w-full items-center gap-3 rounded-xl bg-white px-4 py-3 text-left text-[1.0625rem] leading-snug font-medium text-ink ring-inset transition-colors duration-200 active:translate-y-px ${FOCUS}`;

/* A typed website is accepted with or without its scheme, as long as it has a dot and no spaces. */
const WEBSITE = /^(https?:\/\/)?[^\s/.]+(\.[^\s/.]+)+(\/\S*)?$/i;

interface Answers {
	website: string;
	size: string;
	price: string;
}

type Phase = "questions" | "tracker" | "calendar";
type HeadingRef = RefObject<HTMLHeadingElement | null>;

function CalendarStep({ answers, heading }: { answers: Answers; heading: HeadingRef }) {
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
	return (
		<>
			<h3 ref={heading} tabIndex={-1} className={QUESTION}>
				Pick a time
			</h3>
			<div ref={booker} className={`${CARD_LIFT} mt-8 min-h-[640px] w-full overflow-auto`} />
		</>
	);
}

function TrackerStep({ heading, onBook }: { heading: HeadingRef; onBook: () => void }) {
	return (
		<>
			<h3 ref={heading} tabIndex={-1} className={QUESTION}>
				The tracker starts at ${CLOUD_ENTRY_PRICE_USD} a month
			</h3>
			<p className="mt-4 max-w-[48ch] text-lead leading-[1.45] text-zinc-600">
				It shows what AI says about your brand and ranks what to fix, so your team can do the work.
			</p>
			<p className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
				<Link to="/pricing" className={ACTION}>
					See tracker plans
				</Link>
				<button type="button" onClick={onBook} className={`${LINK} font-medium text-ink`}>
					Book a call anyway
				</button>
			</p>
		</>
	);
}

function WebsiteStep({
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
	return (
		<form
			noValidate
			onSubmit={(event) => {
				event.preventDefault();
				if (!WEBSITE.test(value.trim())) {
					setError("Enter your website, like yourbrand.com.");
					input.current?.focus();
					return;
				}
				onNext();
			}}
		>
			<label htmlFor={`${id}-website`} className={QUESTION}>
				What’s your website?
			</label>
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
				className={`mt-8 block h-16 w-full border-b-2 bg-transparent text-[1.5rem] text-ink outline-none transition-colors duration-200 placeholder:text-zinc-500 focus-visible:border-rust sm:text-[1.875rem] ${error ? "border-rust" : "border-zinc-500"}`}
			/>
			{error ? (
				<p id={`${id}-error`} role="alert" className={`${SMALL} mt-3 font-medium text-rust`}>
					{error}
				</p>
			) : null}
			<p className="mt-8 flex items-center gap-4">
				<button type="submit" className={ACTION}>
					Next
				</button>
				<span className={`${SMALL} hidden items-center gap-1.5 text-zinc-600 sm:inline-flex`}>
					or press Enter
					<CornerDownLeft aria-hidden="true" className="size-3.5" />
				</span>
			</p>
		</form>
	);
}

function ChoiceStep({
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
	heading: HeadingRef;
}) {
	return (
		<>
			<h3 ref={heading} tabIndex={-1} className={QUESTION}>
				{question}
			</h3>
			<ul className="mt-8 grid max-w-xl grid-cols-[minmax(0,1fr)] gap-2.5">
				{options.map((option, index) => {
					const on = picked === option;
					return (
						<li key={option}>
							<button
								type="button"
								aria-pressed={on}
								onClick={() => onPick(option)}
								className={`${CHOICE} ${on ? "ring-2 ring-rust" : "ring-1 ring-zinc-400 hover:ring-ink"}`}
							>
								<span
									aria-hidden="true"
									className={`grid size-7 shrink-0 place-items-center rounded-md text-[0.8125rem] font-medium ring-1 ring-inset ${on ? "bg-rust text-paper ring-rust" : "text-zinc-600 ring-zinc-400"}`}
								>
									{LETTERS[index]}
								</span>
								{option}
							</button>
						</li>
					);
				})}
			</ul>
			<p className={`${SMALL} mt-6 hidden text-zinc-600 sm:block`}>Or press the letter.</p>
		</>
	);
}

/** The dialog's frame: the progress line, where the visitor is and the way out, then the way to write instead. */
function Frame({
	phase,
	index,
	onClose,
	onBack,
	children,
}: {
	phase: Phase;
	index: number;
	onClose: () => void;
	onBack: () => void;
	children: ReactNode;
}) {
	const progress = phase === "questions" ? index / STEP_COUNT : 1;
	return (
		<div className="flex h-full flex-col">
			<div aria-hidden="true" className="h-1 w-full shrink-0 bg-paper-3">
				<div
					className="h-full origin-left bg-rust transition-transform duration-300 motion-reduce:transition-none"
					style={{ transform: `scaleX(${progress})` }}
				/>
			</div>
			<div className="flex shrink-0 items-center justify-between gap-4 px-4 pt-3 sm:px-6">
				<p className={`${SMALL} text-zinc-600`}>
					{phase === "questions" ? `Question ${index + 1} of ${STEP_COUNT}` : "Book a call"}
				</p>
				<button
					type="button"
					onClick={onClose}
					aria-label="Close"
					className={`grid size-11 place-items-center rounded-full text-zinc-700 transition-colors duration-200 hover:bg-paper-2 hover:text-ink ${FOCUS}`}
				>
					<X aria-hidden="true" className="size-5" />
				</button>
			</div>
			<div className="flex min-h-0 flex-1 overflow-y-auto">
				<div className={`m-auto w-full px-6 py-10 ${phase === "calendar" ? "max-w-5xl" : "max-w-2xl"}`}>{children}</div>
			</div>
			<div className="flex shrink-0 items-center justify-between gap-4 px-4 pb-4 sm:px-6 sm:pb-6">
				<p className={`${SMALL} text-zinc-600`}>
					Rather write?{" "}
					<a href={`mailto:${CONTACT_EMAIL}?subject=AI%20search%20agency`} className={`${LINK} text-ink`}>
						Email {CONTACT_EMAIL}
					</a>
				</p>
				{phase === "questions" && index > 0 ? (
					<button type="button" onClick={onBack} className={`${LINK} ${SMALL} shrink-0 font-medium text-ink`}>
						Back
					</button>
				) : null}
			</div>
		</div>
	);
}

/**
 * Booking a call, full screen and one question at a time: the website, the
 * company size and whether the starting price works, then the founders' Cal.com
 * calendar. Cal.com asks the name and email itself; the answers ride with the
 * booking as its notes and metadata. A price that does not work is offered the
 * tracker, with the calendar still a click away. It stays mounted when closed,
 * so reopening it picks up where the visitor left off.
 */
export function BookingDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
	const dialog = useRef<HTMLDialogElement>(null);
	const input = useRef<HTMLInputElement>(null);
	const heading = useRef<HTMLHeadingElement>(null);
	const titleId = useId();
	const [index, setIndex] = useState(0);
	const [answers, setAnswers] = useState<Answers>({ website: "", size: "", price: "" });
	const [phase, setPhase] = useState<Phase>("questions");

	useEffect(() => {
		const node = dialog.current;
		if (!node) return;
		if (open && !node.open) {
			node.showModal();
			trackEvent("agency_call_open", {});
		}
		if (!open && node.open) node.close();
		document.documentElement.style.overflow = open ? "hidden" : "";
	}, [open]);

	// The question in front takes the focus, so a keyboard or screen reader starts on it.
	useEffect(() => {
		if (!open) return;
		if (phase === "questions" && index === 0) input.current?.focus();
		else heading.current?.focus();
	}, [open, index, phase]);

	function pick(option: string) {
		if (index === 1) {
			setAnswers({ ...answers, size: option });
			setIndex(2);
			return;
		}
		setAnswers({ ...answers, price: option });
		setPhase(option === "No" ? "tracker" : "calendar");
	}

	function onKeyDown(event: KeyboardEvent) {
		if (phase !== "questions" || index === 0 || event.metaKey || event.ctrlKey || event.altKey) return;
		const option = (index === 1 ? SIZES : PRICE_FITS)[LETTERS.indexOf(event.key.toUpperCase())];
		if (event.key.length === 1 && option) {
			event.preventDefault();
			pick(option);
		}
	}

	let step: ReactNode;
	if (phase === "calendar") step = <CalendarStep answers={answers} heading={heading} />;
	else if (phase === "tracker") step = <TrackerStep heading={heading} onBook={() => setPhase("calendar")} />;
	else if (index === 0)
		step = (
			<WebsiteStep
				value={answers.website}
				onChange={(website) => setAnswers({ ...answers, website })}
				onNext={() => setIndex(1)}
				input={input}
			/>
		);
	else
		step = (
			<ChoiceStep
				question={
					index === 1
						? "How many people work at your company?"
						: `The agency starts at ${formatUsd(AGENCY_FROM_USD)} a month. Does that work for you?`
				}
				options={index === 1 ? SIZES : PRICE_FITS}
				picked={index === 1 ? answers.size : answers.price}
				onPick={pick}
				heading={heading}
			/>
		);

	return (
		<dialog
			ref={dialog}
			aria-labelledby={titleId}
			onClose={onClose}
			onKeyDown={onKeyDown}
			className="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none bg-paper p-0 text-ink backdrop:bg-ink/40"
		>
			<h2 id={titleId} className="sr-only">
				Book a call
			</h2>
			<Frame phase={phase} index={index} onClose={onClose} onBack={() => setIndex(index - 1)}>
				{step}
			</Frame>
		</dialog>
	);
}
