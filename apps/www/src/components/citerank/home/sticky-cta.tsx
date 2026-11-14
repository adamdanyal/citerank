import { cloudSignupUrl, type ReferralSource } from "@workspace/config/referrals";
import { useEffect, useState } from "react";
import { trackEvent } from "@/lib/posthog";
import { ACTION } from "../v2/kit";

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
			className={`fixed inset-x-0 bottom-0 z-30 border-t border-zinc-200 bg-paper p-3 transition-transform duration-200 ease-out md:hidden ${
				shown ? "translate-y-0" : "translate-y-full"
			}`}
		>
			<a
				href={signupUrl}
				tabIndex={shown ? 0 : -1}
				onClick={() => trackEvent("signup_click", { from: "sticky" })}
				className={`${ACTION} w-full`}
			>
				Start tracking
			</a>
		</div>
	);
}
