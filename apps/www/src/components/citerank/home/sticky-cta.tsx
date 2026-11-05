import { cloudSignupUrl, type ReferralSource } from "@workspace/config/referrals";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { trackEvent } from "@/lib/posthog";
import { EASE_CLASS, PRIMARY_BUTTON } from "../ui";

/** On phones, the main action follows the visitor once the hero has scrolled away. */
export function StickyCta({ from = "marketing-cta" }: { from?: ReferralSource }) {
	const [shown, setShown] = useState(false);
	const signupUrl = cloudSignupUrl(from);

	useEffect(() => {
		const hero = document.querySelector("main > section");
		if (!hero || !("IntersectionObserver" in window)) return;
		const observer = new IntersectionObserver(([entry]) => setShown(!entry.isIntersecting));
		observer.observe(hero);
		return () => observer.disconnect();
	}, []);

	return (
		<div
			aria-hidden={!shown}
			className={`fixed inset-x-0 bottom-0 z-30 border-t border-zinc-200 bg-white/95 p-3 backdrop-blur-md transition-transform duration-300 ${EASE_CLASS} md:hidden ${
				shown ? "translate-y-0" : "translate-y-full"
			}`}
		>
			<a
				href={signupUrl}
				tabIndex={shown ? 0 : -1}
				onClick={() => trackEvent("signup_click", { from: "sticky" })}
				className={`${PRIMARY_BUTTON} w-full`}
			>
				Start tracking
				<ArrowRight className="size-4" aria-hidden="true" />
			</a>
		</div>
	);
}
