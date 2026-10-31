import { DEFAULT_APP_ICON, DEFAULT_APP_NAME } from "@workspace/config/constants";
import { cn } from "@workspace/ui/lib/utils";
import type { ComponentPropsWithoutRef } from "react";

export function Logo({ className, ...props }: ComponentPropsWithoutRef<"span">) {
	return (
		<span {...props} className={cn("inline-flex items-center gap-2 font-heading text-xl text-ink", className)}>
			<img src={DEFAULT_APP_ICON} alt="" aria-hidden width={24} height={24} className="size-[1.1em]" />
			{DEFAULT_APP_NAME}
		</span>
	);
}
