/**
 * The pitch shown beside the sign-in and sign-up forms in local and cloud mode.
 *
 * Sign-in is the highest-intent page either deployment has, so it carries the
 * argument for the product rather than just a card on an empty background: what
 * Elmo does, which engines it reaches, and — for a self-hosted instance — that
 * a managed option exists.
 *
 * Demo and whitelabel deliberately never see this. A demo visitor has already
 * decided to look, and a whitelabel tenant is not ours to sell to.
 */

import { IconCalendar, IconCheck, IconCloud } from "@tabler/icons-react";
import { platformTierMembers } from "@workspace/config/plans";
import { cloudPricingUrl, cloudSignupUrl, marketingUrl, type ReferralSource } from "@workspace/config/referrals";
import { ModelIcon } from "@workspace/ui/brand/model-icon";
import { buttonVariants } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import type { ReactNode } from "react";

/** Everything Elmo reaches, named — the coverage claim is the product. */
const ENGINES = [...platformTierMembers("scraped"), ...platformTierMembers("api")];

interface Bullet {
	/** Doubles as the list key. */
	text: string;
	/** Set where the bullet is an invitation rather than a statement. */
	href?: string;
}

interface Pitch {
	headline: string;
	bullets: Bullet[];
}

const CLOUD_PITCH: Pitch = {
	headline: "See what AI says about your business.",
	bullets: [
		{ text: "Your buyers' questions, asked in the AI apps you choose" },
		{ text: "How often you are named against each competitor" },
		{ text: "Every answer in full, with the pages it cites" },
		{ text: "A ranked list of what to do next, about once a week" },
	],
};

const SELF_HOSTED_PITCH: Pitch = {
	headline: "Self-host your AEO.",
	bullets: [
		{ text: "Track your AI visibility on any model" },
		{ text: "Unlimited prompts, brands, and seats" },
		{ text: "Bring your own model and scraper keys" },
	],
};

type SalesPanelVariant = "cloud" | "self-hosted";

export function SalesPanel({ variant, source }: { variant: SalesPanelVariant; source: ReferralSource }) {
	const pitch = variant === "cloud" ? CLOUD_PITCH : SELF_HOSTED_PITCH;

	return (
		<div className="flex flex-1 flex-col justify-between gap-8">
			<h2 className="text-3xl font-semibold leading-[1.1] tracking-tight text-balance">{pitch.headline}</h2>

			<ul className="space-y-2.5">
				{pitch.bullets.map((bullet) => (
					<li key={bullet.text} className="flex items-start gap-2.5 text-sm">
						<IconCheck className="mt-0.5 size-4 shrink-0 text-primary" />
						{bullet.href ? (
							<a
								href={bullet.href}
								target="_blank"
								rel="noopener noreferrer"
								className="underline underline-offset-2 hover:opacity-80"
							>
								{bullet.text}
							</a>
						) : (
							<span>{bullet.text}</span>
						)}
					</li>
				))}
			</ul>

			<EngineStrip />

			<OfferCard
				question={variant === "self-hosted" ? "Don't want to self-host?" : "Want it done for you?"}
				offer={variant === "self-hosted" ? cloudOffer(source) : agencyOffer(source)}
			/>
		</div>
	);
}

/** The coverage claim, spelled out. Names sit beside logos because three Google surfaces share a mark. */
function EngineStrip() {
	return (
		<div>
			<p className="font-mono text-[10px] uppercase leading-none tracking-[0.2em] text-muted-foreground">Tracking</p>
			<ul className="mt-3 flex flex-wrap gap-1.5">
				{ENGINES.map((engine) => (
					<li
						key={engine.model}
						className="inline-flex items-center gap-1.5 rounded-md border bg-card px-2 py-1 text-[11px] leading-none"
					>
						<ModelIcon iconId={engine.iconId} className="size-3 shrink-0 text-muted-foreground" />
						{engine.label}
					</li>
				))}
			</ul>
		</div>
	);
}

interface Offer {
	label: string;
	href: string;
	icon: typeof IconCalendar;
	/** Somewhere to look around rather than a conversion — worth keeping this page open for. */
	newTab?: boolean;
}

const agencyOffer = (source: ReferralSource): Offer => ({
	label: "Book a Call",
	href: marketingUrl("/agency", source),
	icon: IconCalendar,
	newTab: true,
});

const cloudOffer = (source: ReferralSource): Offer => ({
	label: "Try CiteRank.com",
	href: cloudSignupUrl(source),
	icon: IconCloud,
});

/**
 * The secondary ask, in whichever form the deployment calls for: a way to see
 * Elmo before signing up, or the managed option for someone already running it.
 *
 * One way out, not a menu. The question and its answer are a single exchange,
 * so they share a line — the question anchored left, the answer right — and
 * wrap together when the panel is too narrow to hold both.
 */
function OfferCard({ question, offer, className = "" }: { question: string; offer: Offer; className?: string }) {
	return (
		<div
			className={`flex flex-wrap items-center justify-between gap-x-4 gap-y-3 rounded-lg border bg-card p-5 ${className}`}
		>
			<h3 className="text-sm font-semibold">{question}</h3>
			<a
				href={offer.href}
				className={cn(
					buttonVariants({ variant: "ghost", size: "sm" }),
					"bg-accent text-accent-foreground hover:underline dark:bg-accent/50",
				)}
				{...(offer.newTab ? { target: "_blank", rel: "noopener" } : {})}
			>
				<offer.icon className="size-4" />
				{offer.label}
			</a>
		</div>
	);
}

/** The bottom of the form column: where to read more. */
export function SalesFooterLinks({ source }: { source: ReferralSource }): ReactNode {
	const linkClass = "hover:text-foreground";
	return (
		<div className="flex w-full flex-wrap items-center justify-between gap-x-4 gap-y-2">
			<p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
				<a href={marketingUrl("/docs", source)} className={linkClass}>
					Docs
				</a>
				<a href={cloudPricingUrl(source)} className={linkClass}>
					Pricing
				</a>
			</p>
		</div>
	);
}
