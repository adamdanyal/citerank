import { describe, expect, it } from "vitest";
import { frameAncestors } from "../frame-ancestors";

describe("frameAncestors", () => {
	it.each(["cloud", "local", "whitelabel", undefined])("lets nothing frame the app in %s mode", (mode) => {
		expect(frameAncestors(mode, "https://citerank.com")).toEqual([]);
	});

	it("lets only the marketing site frame the demo, with and without www", () => {
		expect(frameAncestors("demo", "https://citerank.com")).toEqual([
			"https://citerank.com",
			"https://www.citerank.com",
		]);
		expect(frameAncestors("demo", "https://www.citerank.com/")).toEqual([
			"https://www.citerank.com",
			"https://citerank.com",
		]);
	});

	it("covers both names for this machine when the marketing site runs locally", () => {
		expect(frameAncestors("demo", "http://localhost:3001")).toEqual(["http://localhost:3001", "http://127.0.0.1:3001"]);
		expect(frameAncestors("demo", "http://127.0.0.1:3001")).toEqual(["http://127.0.0.1:3001", "http://localhost:3001"]);
	});
});
