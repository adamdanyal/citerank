import { createServerFn } from "@tanstack/react-start";
import type { StatusEntry, TargetStatus } from "./status-helpers";

export type { TargetStatus } from "./status-helpers";

const WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

// The server's scheduled provider test writes this file. Until its first run there is none, and the page is empty.
export const getStatusData = createServerFn({ method: "GET" }).handler(async (): Promise<TargetStatus[]> => {
	const { readFile } = await import("node:fs/promises");
	let stored: Record<string, StatusEntry[]>;
	try {
		stored = JSON.parse(await readFile(process.env.STATUS_DATA_FILE ?? "/data/provider-status.json", "utf8"));
	} catch {
		return [];
	}

	const since = Date.now() - WINDOW_MS;
	return Object.entries(stored)
		.map(([target, entries]) => ({
			target,
			entries: entries.filter((entry) => new Date(entry.ts).getTime() >= since),
		}))
		.filter((status) => status.entries.length > 0);
});
