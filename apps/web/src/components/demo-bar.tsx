import { cloudSignupUrl } from "@workspace/config/referrals";
import { buttonVariants } from "@workspace/ui/components/button";
import { useDeploymentFeatures } from "@/hooks/use-deployment-features";

const SIGNUP_URL = cloudSignupUrl("demo-header");

export function DemoBar() {
	const features = useDeploymentFeatures();
	if (!features?.readOnly) return null;

	return (
		// An opaque tint: the page scrolls underneath, so a see-through one would show it.
		<div className="sticky top-0 z-20 flex h-[var(--demo-bar-height,2.5rem)] items-center justify-center gap-3 bg-[color-mix(in_srgb,var(--primary)_10%,var(--background))] px-4 text-sm">
			<p className="truncate">
				<span className="font-medium">This is a demo.</span>{" "}
				<span className="hidden text-muted-foreground sm:inline">The brand and its numbers are made up.</span>
			</p>
			{features.promotesCloud && (
				<a href={SIGNUP_URL} target="_blank" rel="noopener" className={buttonVariants({ size: "sm" })}>
					Start Tracking
				</a>
			)}
		</div>
	);
}
