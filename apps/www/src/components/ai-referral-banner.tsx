import { useLocation } from "@tanstack/react-router";
import { cloudAppUrl } from "@workspace/config/referrals";
import { X } from "lucide-react";
import { WRAP } from "@/components/citerank/v2/kit";
import { useAiReferral } from "@/lib/ai-referral";

const CLOUD_URL = cloudAppUrl("marketing-ai-referral");

export function AiReferralBanner() {
	const pathname = useLocation({ select: (location) => location.pathname });
	const [referral, setReferral] = useAiReferral();

	if (!referral || referral.dismissed || pathname === "/") return null;

	return (
		<div className="relative bg-rust text-[0.875rem] leading-[1.5] text-paper">
			<div className={`${WRAP} flex min-h-11 items-center justify-center py-2 pr-12 text-center`}>
				<p>
					{referral.assistant} sent you here. Want it to recommend you too?{" "}
					<a
						href={CLOUD_URL}
						className="rounded-sm font-medium whitespace-nowrap underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper"
					>
						Start tracking
					</a>
				</p>
			</div>
			<button
				type="button"
				onClick={() => setReferral({ ...referral, dismissed: true })}
				aria-label="Dismiss"
				className="absolute top-1/2 right-1 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full text-paper focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-paper"
			>
				<X className="size-4" aria-hidden="true" />
			</button>
		</div>
	);
}
