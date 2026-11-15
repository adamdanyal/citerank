// CiteRank.com: offers tracker clients a call with the agency, with their details already filled in.
import { bookDemoUrl } from "@workspace/config/referrals";
import { Button } from "@workspace/ui/components/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@workspace/ui/components/dialog";
import { trackAdConversion } from "@workspace/ui/lib/ad-tags";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useBrand } from "@/hooks/use-brands";
import { useDeploymentMode } from "@/hooks/use-deployment-features";
import { embedInlineBooking } from "@/lib/cal-embed";
import { trackEvent } from "@/lib/posthog";

const CAL_LINK = "citerank/30mins";
const AGENCY_FROM = "$4,995";

type Step = "price" | "calendar" | "no";

export function AgencyStrip() {
	const mode = useDeploymentMode();
	const [open, setOpen] = useState(false);
	if (mode !== "cloud" && mode !== "local" && mode !== "demo") return null;

	return (
		<div className="flex flex-col gap-3 rounded-xl border border-border bg-muted/40 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
			<p className="text-sm">
				<span className="font-medium">Want us to do this work?</span>{" "}
				<span className="text-muted-foreground">Our agency does it every month.</span>
			</p>
			{mode === "demo" ? (
				<Button render={<a href={bookDemoUrl("demo-opportunities")} />} nativeButton={false} className="shrink-0">
					Book a Call
				</Button>
			) : (
				<Button
					className="shrink-0"
					onClick={() => {
						setOpen(true);
						trackEvent("agency_call_open", { from: "opportunities" });
					}}
				>
					Book a Call
				</Button>
			)}
			{mode !== "demo" && <BookingDialog open={open} onOpenChange={setOpen} />}
		</div>
	);
}

function BookingDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
	const [step, setStep] = useState<Step>("price");

	return (
		<Dialog
			open={open}
			onOpenChange={(next) => {
				onOpenChange(next);
				if (!next && step === "no") setStep("price");
			}}
		>
			<DialogContent className={step === "calendar" ? "sm:max-w-4xl" : undefined}>
				{step === "price" && (
					<>
						<DialogHeader>
							<DialogTitle>Book a Call</DialogTitle>
							<DialogDescription>The agency starts at {AGENCY_FROM} a month. Does that work for you?</DialogDescription>
						</DialogHeader>
						<DialogFooter>
							<Button variant="outline" onClick={() => setStep("no")}>
								No
							</Button>
							<Button
								onClick={() => {
									setStep("calendar");
									trackEvent("agency_call_calendar", { price: "Yes", from: "opportunities" });
								}}
							>
								Yes
							</Button>
						</DialogFooter>
					</>
				)}
				{step === "no" && (
					<>
						<DialogHeader>
							<DialogTitle>No Problem</DialogTitle>
							<DialogDescription>You can do this work yourself with the tracker.</DialogDescription>
						</DialogHeader>
						<DialogFooter>
							<Button onClick={() => onOpenChange(false)}>Close</Button>
						</DialogFooter>
					</>
				)}
				{step === "calendar" && <CalendarStep />}
			</DialogContent>
		</Dialog>
	);
}

function CalendarStep() {
	const { user } = useAuth();
	const { data: brand } = useBrand();
	const frame = useRef<HTMLDivElement>(null);
	const embedded = useRef(false);

	useEffect(() => {
		if (!frame.current || !brand || embedded.current) return;
		embedded.current = true;
		const { website } = brand;
		embedInlineBooking({
			element: frame.current,
			calLink: CAL_LINK,
			config: {
				...(user?.name ? { name: user.name } : {}),
				...(user?.email ? { email: user.email } : {}),
				notes: [
					`Website: ${website}`,
					`Brand: ${brand.name}`,
					`${AGENCY_FROM} a month works: Yes`,
					"Booked from the tracker app",
				].join("\n"),
				"metadata[website]": website,
				"metadata[priceWorks]": "Yes",
				"metadata[source]": "tracker-app",
			},
			onBooked: (uid) => trackAdConversion("demo_booked", { id: uid, email: user?.email }),
		});
	}, [user?.name, user?.email, brand]);

	return (
		<>
			<DialogHeader>
				<DialogTitle>Pick a Time</DialogTitle>
				<DialogDescription>Your name, email and website are already filled in.</DialogDescription>
			</DialogHeader>
			<div ref={frame} className="max-h-[70vh] min-h-[28rem] overflow-y-auto" />
		</>
	);
}
