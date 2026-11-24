import { SidebarInset, SidebarProvider } from "@workspace/ui/components/sidebar";
import type { ReactNode } from "react";
import { DemoBar } from "@/components/demo-bar";
import { useDeploymentFeatures } from "@/hooks/use-deployment-features";

export function AppShell({
	sidebar,
	header,
	children,
}: {
	sidebar: ReactNode;
	header: ReactNode;
	children: ReactNode;
}) {
	const readOnly = useDeploymentFeatures()?.readOnly ?? false;
	const shell = (
		<SidebarProvider className="min-h-[calc(100svh-var(--demo-bar-height,0px))]">
			{sidebar}
			{/* `overflow-clip`, not `overflow-hidden`: both clip to the rounded corners,
			    but `hidden` makes this a scroll container, which stops descendants from
			    sticking to the viewport (the site header included). */}
			<SidebarInset className="md:border md:border-border/60 md:rounded-xl overflow-clip">
				{header}
				{children}
			</SidebarInset>
		</SidebarProvider>
	);
	if (!readOnly) return shell;

	// The bar sits above the whole app, so the sidebar and the site header, which
	// pin themselves to the top of the screen, read its height and start below it.
	return (
		<div className="[--demo-bar-height:2.5rem]">
			<DemoBar />
			{shell}
		</div>
	);
}

export function PageContent({ children }: { children: ReactNode }) {
	return (
		<div className="flex flex-1 flex-col">
			<div className="@container/main flex flex-1 flex-col gap-2">
				<div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">{children}</div>
			</div>
		</div>
	);
}
