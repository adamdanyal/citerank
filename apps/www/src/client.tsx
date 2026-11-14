import { StartClient } from "@tanstack/react-start/client";
import { StrictMode, startTransition } from "react";
import { hydrateRoot } from "react-dom/client";

/*
 * Every page arrives fully rendered, so React can wait a frame. Hydrating at
 * once holds the main thread for a few hundred milliseconds before the browser
 * has painted anything, which puts the first paint behind every script.
 */
let started = false;

function hydrate() {
	if (started) return;
	started = true;
	startTransition(() => {
		hydrateRoot(
			document,
			<StrictMode>
				<StartClient />
			</StrictMode>,
		);
	});
}

requestAnimationFrame(() => setTimeout(hydrate, 0));
// A tab opened in the background gets no frame until it is shown.
setTimeout(hydrate, 1000);
