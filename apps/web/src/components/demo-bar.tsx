import { cloudSignupUrl } from "@workspace/config/referrals";
import { buttonVariants } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { useDeploymentFeatures } from "@/hooks/use-deployment-features";

const SIGNUP_URL = cloudSignupUrl("demo-header");

export function DemoBar() {
	const features = useDeploymentFeatures();
	if (!features?.readOnly) return null;

	return (
		// An opaque tint: the page scrolls underneath, so a see-through one would show it.
		<div className="sticky top-0 z-20 flex h-[var(--demo-bar-height,2.5rem)] items-center justify-center gap-2.5 bg-[color-mix(in_srgb,var(--primary)_10%,var(--background))] px-3 text-[13px] sm:gap-3 sm:px-4 sm:text-sm">
			<p className="truncate">
				<span className="font-medium">This is a demo</span>
				{/* The narrowest phones have room for the button or these words, not both. */}
				<span className="hidden min-[360px]:inline"> with sample data</span>.
			</p>
			{features.promotesCloud && (
				<a
					href={SIGNUP_URL}
					target="_blank"
					rel="noopener"
					className={cn(buttonVariants({ size: "sm" }), "h-7 px-2.5 text-xs sm:text-[13px]")}
				>
					Track Your Brand
				</a>
			)}
		</div>
	);
}
