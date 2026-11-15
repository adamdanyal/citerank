import { getModelMeta } from "@workspace/config/models";
import { useId } from "react";
import { EngineIcon, GEMINI_PATH } from "@/components/home/engines";

/** Gemini shares Google's mark in the catalog, which would make it indistinguishable from AI Overviews. */
const ICON_OVERRIDES: Record<string, string> = { gemini: "gemini" };

/* An app is known by its colour as much as its shape, so each logo is drawn in its own. The ones not listed are black in life too. */
const LOGO_COLOUR: Record<string, string> = {
	anthropic: "text-logo-claude",
	perplexity: "text-logo-perplexity",
	mistral: "text-logo-mistral",
	deepseek: "text-logo-deepseek",
	qwen: "text-logo-qwen",
	meta: "text-logo-meta",
};

export const appLabel = (model: string) => getModelMeta(model).label;
export const appIconId = (model: string) => ICON_OVERRIDES[model] ?? getModelMeta(model).iconId;

/** An AI app's logo in its own colours. It names nothing a reader needs, so it is hidden from one. */
export function AppLogo({ id, className = "size-6" }: { id: string; className?: string }) {
	const gradient = useId();
	if (id === "google") {
		return (
			<svg aria-hidden="true" viewBox="0 0 48 48" className={`shrink-0 ${className}`}>
				<path
					className="fill-logo-google-red"
					d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
				/>
				<path
					className="fill-logo-google-blue"
					d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
				/>
				<path
					className="fill-logo-google-yellow"
					d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
				/>
				<path
					className="fill-logo-google-green"
					d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
				/>
			</svg>
		);
	}
	if (id === "gemini") {
		return (
			<svg aria-hidden="true" viewBox="0 0 24 24" className={`shrink-0 ${className}`}>
				<defs>
					<linearGradient id={gradient} x1="0" y1="1" x2="1" y2="0">
						<stop offset="0" className="[stop-color:var(--color-logo-gemini-1)]" />
						<stop offset="0.5" className="[stop-color:var(--color-logo-gemini-2)]" />
						<stop offset="1" className="[stop-color:var(--color-logo-gemini-3)]" />
					</linearGradient>
				</defs>
				<path fill={`url(#${gradient})`} d={GEMINI_PATH} />
			</svg>
		);
	}
	return <EngineIcon iconId={id} className={`shrink-0 ${className} ${LOGO_COLOUR[id] ?? "text-ink"}`} />;
}
