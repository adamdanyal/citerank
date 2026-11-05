import { cloudSignupUrl, type ReferralSource } from "@workspace/config/referrals";
import { ArrowRight } from "lucide-react";
import { useId } from "react";
import { EASE_CLASS, PRIMARY_BUTTON_LG } from "../ui";

/*
 * The first step of sign-up, on the page itself. A plain GET form, so it works
 * before JavaScript loads: the browser sends the email and the referral tag to
 * the app's register page, which fills the email in.
 */
export function SignupForm({ from, className = "" }: { from: ReferralSource; className?: string }) {
	const id = useId();
	const target = new URL(cloudSignupUrl(from));
	const action = `${target.origin}${target.pathname}`;
	const ref = target.searchParams.get("ref") ?? from;

	return (
		<form action={action} method="get" className={`flex w-full flex-col gap-3 sm:flex-row ${className}`}>
			<input type="hidden" name="ref" value={ref} />
			<label htmlFor={id} className="sr-only">
				Work email
			</label>
			<input
				id={id}
				name="email"
				type="email"
				required
				autoComplete="email"
				placeholder="Your work email"
				className={`h-12 min-w-0 flex-1 rounded-lg bg-white px-4 body-3 text-zinc-950 ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 transition-[box-shadow] duration-300 ${EASE_CLASS} focus:outline-none focus:ring-2 focus:ring-blue-600 sm:w-80`}
			/>
			<button type="submit" className={PRIMARY_BUTTON_LG}>
				Start tracking
				<ArrowRight className="size-4" aria-hidden="true" />
			</button>
		</form>
	);
}
