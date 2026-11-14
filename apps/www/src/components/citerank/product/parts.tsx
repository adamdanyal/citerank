import { createContext, type ReactNode, useContext } from "react";
import { EngineIcon } from "@/components/home/engines";
import { type AnswerKind, engineOf, placeOf, TONE_LABEL, TONE_TEXT, toneOf } from "./data";

export const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust";
export const BOX = "rounded-xl bg-white ring-1 ring-zinc-200";
export const BOX_TITLE = "text-base leading-snug font-medium text-ink";

/*
 * A screen shown inside a link is a picture of the product, not the product:
 * its controls are drawn but cannot be pressed, since a button may not sit
 * inside a link.
 */
const StillContext = createContext(false);
export const Still = StillContext.Provider;
export const useStill = () => useContext(StillContext);

export function Press({
	pressed,
	onPress,
	className = "",
	children,
}: {
	pressed?: boolean;
	onPress: () => void;
	className?: string;
	children: ReactNode;
}) {
	if (useStill()) return <span className={className}>{children}</span>;
	return (
		<button type="button" aria-pressed={pressed} onClick={onPress} className={`${className} ${FOCUS}`}>
			{children}
		</button>
	);
}

export function Segmented<Id extends string>({
	label,
	options,
	value,
	onChange,
	className = "",
}: {
	label: string;
	options: { id: Id; label: ReactNode }[];
	value: Id;
	onChange: (id: Id) => void;
	className?: string;
}) {
	return (
		<fieldset
			aria-label={label}
			className={`inline-flex max-w-full min-w-0 flex-wrap gap-1 rounded-lg bg-paper-2 p-1 ${className}`}
		>
			{options.map((option) => (
				<Press
					key={option.id}
					pressed={option.id === value}
					onPress={() => onChange(option.id)}
					className={`inline-flex h-9 items-center gap-1.5 rounded-md px-3 text-sm whitespace-nowrap ${
						option.id === value ? "bg-white font-medium text-ink shadow-card" : "text-zinc-600 hover:text-ink"
					}`}
				>
					{option.label}
				</Press>
			))}
		</fieldset>
	);
}

/* The made-up brands' marks, in leaderboard order. The live demo draws the same ones. */
const MARKS: { ground: string; glyph: ReactNode }[] = [
	{
		ground: "bg-mark-1",
		glyph: (
			<>
				<path
					d="M18 22a8 8 0 0 1 8-8h12a8 8 0 0 1 8 8v10a8 8 0 0 1-8 8h-6l-8 7v-7a8 8 0 0 1-6-8z"
					fill="currentColor"
				/>
				<circle cx="38" cy="25" r="3" className="fill-mark-1" />
			</>
		),
	},
	{
		ground: "bg-mark-2",
		glyph: (
			<>
				<rect x="16" y="18" width="32" height="6" rx="3" fill="currentColor" />
				<rect x="16" y="29" width="24" height="6" rx="3" fill="currentColor" />
				<rect x="16" y="40" width="16" height="6" rx="3" fill="currentColor" />
			</>
		),
	},
	{ ground: "bg-mark-3", glyph: <path d="M32 12l14 34-14-8-14 8z" fill="currentColor" /> },
	{
		ground: "bg-mark-4",
		glyph: (
			<path
				d="M14 30c6-6 12-6 18 0s12 6 18 0M14 42c6-6 12-6 18 0s12 6 18 0"
				stroke="currentColor"
				strokeWidth="5"
				fill="none"
				strokeLinecap="round"
			/>
		),
	},
	{
		ground: "bg-mark-5",
		glyph: (
			<>
				<path d="M32 14c10 0 16 8 16 16s-7 14-16 14-16-6-16-14 6-16 16-16z" fill="currentColor" />
				<path d="M32 22v28" className="stroke-mark-5" strokeWidth="4" />
			</>
		),
	},
	{ ground: "bg-mark-6", glyph: <path d="M14 20h36v8a4 4 0 0 0 0 8v8H14v-8a4 4 0 0 0 0-8z" fill="currentColor" /> },
	{
		ground: "bg-mark-7",
		glyph: (
			<>
				<circle cx="32" cy="32" r="9" fill="currentColor" />
				<path
					d="M32 12v6M32 46v6M12 32h6M46 32h6M18 18l4 4M42 42l4 4M18 46l4-4M42 22l4-4"
					stroke="currentColor"
					strokeWidth="4"
					strokeLinecap="round"
				/>
			</>
		),
	},
	{
		ground: "bg-mark-8",
		glyph: (
			<>
				<circle cx="32" cy="26" r="7" fill="currentColor" />
				<path
					d="M32 33v17M22 50c2-8 6-11 10-11s8 3 10 11"
					stroke="currentColor"
					strokeWidth="4"
					fill="none"
					strokeLinecap="round"
				/>
			</>
		),
	},
	{ ground: "bg-mark-9", glyph: <path d="M32 12l14 20h-8l10 14H16l10-14h-8z" fill="currentColor" /> },
];

export function Mark({ name, className = "size-5" }: { name: string; className?: string }) {
	const mark = MARKS[placeOf(name) % MARKS.length];
	return (
		<svg
			aria-hidden="true"
			viewBox="0 0 64 64"
			className={`shrink-0 rounded-md text-white ${mark.ground} ${className}`}
		>
			{mark.glyph}
		</svg>
	);
}

export function Engine({
	model,
	named = false,
	className = "size-4",
}: {
	model: string;
	named?: boolean;
	className?: string;
}) {
	const engine = engineOf(model);
	return (
		<span className="inline-flex items-center gap-1.5">
			<EngineIcon iconId={engine.iconId} className={`shrink-0 ${className}`} />
			<span className={named ? "" : "sr-only"}>{engine.label}</span>
		</span>
	);
}

export function ToneWord({ kind }: { kind: AnswerKind }) {
	return <span className={TONE_TEXT[kind]}>{TONE_LABEL[kind]}</span>;
}

/* A square of the series' colour: the key to a line, a bar or a slice. */
export function Swatch({ tone }: { tone: string }) {
	return <span aria-hidden="true" className={`size-2.5 shrink-0 rounded-xs bg-current ${tone}`} />;
}

export function Legend({ names }: { names: string[] }) {
	return (
		<ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-600">
			{names.map((name) => (
				<li key={name} className="flex items-center gap-1.5">
					<Swatch tone={toneOf(name)} />
					{name}
				</li>
			))}
		</ul>
	);
}

export function Stat({ label, value, className = "" }: { label: string; value: string; className?: string }) {
	return (
		<div className={`${BOX} p-4 ${className}`}>
			<p className="text-sm text-zinc-600">{label}</p>
			<p className="mt-2 font-mono text-[1.75rem] leading-none font-medium tracking-[-0.03em] text-ink">{value}</p>
		</div>
	);
}

export function Chip({ children, className = "" }: { children: ReactNode; className?: string }) {
	return (
		<span className={`inline-flex items-center gap-1.5 rounded-lg px-2 py-1 ring-1 ring-zinc-200 ${className}`}>
			{children}
		</span>
	);
}
