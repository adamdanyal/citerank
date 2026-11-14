import { X } from "lucide-react";
import { type ComponentPropsWithoutRef, type MouseEvent, useEffect, useRef, useState } from "react";
import { externalRel } from "@/lib/external-link";
import { LINK_ON_INK } from "./kit";

/* Set VITE_DEMO_EMBED=off where the demo deployment does not yet allow this site to frame it. */
const EMBED = import.meta.env.VITE_DEMO_EMBED !== "off";
/* Below this the product gets the whole screen in its own tab, which serves it better than a panel. */
const PANEL_FROM = "(min-width: 1024px)";

/**
 * A link to the live demo. On a wide screen it opens the real product in a
 * panel on this page, so a visitor can use it without leaving or signing up.
 * The frame is only created when the panel opens, so it costs the page nothing
 * until then. Without script, on a narrow screen, or with a modifier key held,
 * it is an ordinary link to the demo in a new tab.
 */
export function LiveDemoLink({
	href,
	onOpen,
	children,
	...rest
}: { href: string; onOpen?: () => void } & Omit<ComponentPropsWithoutRef<"a">, "href" | "onClick" | "target" | "rel">) {
	const dialog = useRef<HTMLDialogElement>(null);
	const [open, setOpen] = useState(false);

	useEffect(() => {
		if (open) dialog.current?.showModal();
	}, [open]);

	function onClick(event: MouseEvent<HTMLAnchorElement>) {
		onOpen?.();
		if (!EMBED || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
		if (!window.matchMedia(PANEL_FROM).matches) return;
		event.preventDefault();
		setOpen(true);
	}

	return (
		<>
			<a {...rest} href={href} target="_blank" rel={externalRel(href)} onClick={onClick}>
				{children}
			</a>
			<dialog
				ref={dialog}
				aria-label="CiteRank.com live demo"
				onClose={() => setOpen(false)}
				className="m-auto h-[min(60rem,92dvh)] w-[min(96rem,96dvw)] max-w-none overflow-hidden rounded-card bg-paper p-0 text-ink backdrop:bg-ink/70"
			>
				{open ? (
					<div className="flex h-full flex-col">
						<div className="flex h-14 shrink-0 items-center gap-6 bg-ink px-5 text-paper">
							<p className="text-[0.9375rem] font-medium">Live demo</p>
							<p className="hidden text-[0.875rem] text-zinc-300 xl:block">
								The real product on sample data. Nothing you do here is saved.
							</p>
							<a
								href={href}
								target="_blank"
								rel={externalRel(href)}
								className={`${LINK_ON_INK} ml-auto text-[0.875rem] whitespace-nowrap text-paper`}
							>
								Open in a new tab
							</a>
							<button
								type="button"
								onClick={() => dialog.current?.close()}
								aria-label="Close the live demo"
								className="-mr-2 inline-flex size-11 items-center justify-center rounded-full text-paper transition-colors duration-200 hover:bg-ink-well focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-paper"
							>
								<X className="size-5" aria-hidden="true" />
							</button>
						</div>
						<iframe src={href} title="CiteRank.com live demo" className="block min-h-0 w-full flex-1 bg-paper" />
					</div>
				) : null}
			</dialog>
		</>
	);
}
