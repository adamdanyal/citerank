import type { ReactNode } from "react";
import { type AnswerKind, PREVIEW, TONE_LABEL } from "../../product/data";
import { Press } from "../../product/parts";

/* Inside a 20px window with 12px of padding: 20 − 12. */
export const BOX = "rounded-[8px] bg-(--v3-card) ring-1 ring-(--v3-line)";
export const BOX_TITLE = "text-[0.9375rem] leading-snug font-medium text-(--v3-text)";

const RIVAL_TONES = ["text-(--v3-series-1)", "text-(--v3-series-2)", "text-(--v3-series-3)", "text-(--v3-series-4)"];
const RIVALS = PREVIEW.leaderboard.map((entry) => entry.name).filter((name) => name !== PREVIEW.brand);

/** Your brand's series is the one rust line; every rival is a neutral step, the nearest darkest. */
export function toneOf(name: string) {
	if (name === PREVIEW.brand) return "text-(--v3-rust)";
	const place = RIVALS.indexOf(name);
	return RIVAL_TONES[(place === -1 ? RIVAL_TONES.length - 1 : place) % RIVAL_TONES.length];
}

export const TONE_TEXT: Record<AnswerKind, string> = {
	positive: "text-(--v3-good)",
	neutral: "text-(--v3-text-2)",
	mixed: "text-(--v3-text-2)",
	negative: "text-(--v3-bad)",
	unmentioned: "text-(--v3-text-3)",
};
export const TONE_FILL: Record<AnswerKind, string> = {
	positive: "bg-(--v3-good)",
	neutral: "bg-(--v3-series-3)",
	mixed: "bg-(--v3-series-2)",
	negative: "bg-(--v3-bad)",
	unmentioned: "bg-(--v3-raised)",
};

export function ToneWord({ kind }: { kind: AnswerKind }) {
	return <span className={TONE_TEXT[kind]}>{TONE_LABEL[kind]}</span>;
}

/* The key to a line: a short stroke in the line's own tone. */
export function LineKey({ tone }: { tone: string }) {
	return <span aria-hidden="true" className={`h-0.5 w-3 shrink-0 rounded-full bg-current ${tone}`} />;
}

export function Legend({ names }: { names: string[] }) {
	return (
		<ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-(--v3-text-2)">
			{names.map((name) => (
				<li key={name} className="flex items-center gap-1.5">
					<LineKey tone={toneOf(name)} />
					{name}
				</li>
			))}
		</ul>
	);
}

export function Segmented<Id extends string>({
	label,
	options,
	value,
	onChange,
}: {
	label: string;
	options: { id: Id; label: ReactNode }[];
	value: Id;
	onChange: (id: Id) => void;
}) {
	return (
		<fieldset
			aria-label={label}
			className="inline-flex max-w-full min-w-0 flex-wrap gap-1 rounded-[8px] bg-(--v3-raised) p-1"
		>
			{options.map((option) => (
				<Press
					key={option.id}
					pressed={option.id === value}
					onPress={() => onChange(option.id)}
					className={`inline-flex h-9 items-center gap-1.5 rounded-[4px] px-3 text-sm whitespace-nowrap transition-colors duration-150 ease-(--v3-ease) ${
						option.id === value
							? "bg-(--v3-card) font-medium text-(--v3-text) shadow-(--v3-shadow-sm)"
							: "text-(--v3-text-2) hover:text-(--v3-text)"
					}`}
				>
					{option.label}
				</Press>
			))}
		</fieldset>
	);
}

export function Chip({ children, className = "" }: { children: ReactNode; className?: string }) {
	return (
		<span className={`inline-flex items-center gap-1.5 rounded-[6px] px-2 py-1 ring-1 ring-(--v3-line) ${className}`}>
			{children}
		</span>
	);
}
