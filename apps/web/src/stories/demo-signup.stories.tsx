import type { Meta, StoryObj } from "@storybook/react";
import { DEFAULT_CHART_COLORS } from "@workspace/config/constants";
import { expect, within } from "storybook/test";
import { DemoBar } from "@/components/demo-bar";
import { UnsavedChangesBar } from "@/components/unsaved-changes-bar";
import { READ_ONLY_REFUSED } from "@/lib/read-only-errors";
import { type ClientConfig, setMockClientConfig } from "./_mocks/config-client";
import { setMockRouteContext } from "./_mocks/tanstack-router";

const demoConfig: ClientConfig = {
	mode: "demo",
	features: { readOnly: true, showOptimizeButton: false, canCreateBrands: false, promotesCloud: true },
	branding: { name: "Elmo", chartColors: DEFAULT_CHART_COLORS },
	analytics: {},
};

const readOnlySelfHostConfig: ClientConfig = {
	...demoConfig,
	features: { ...demoConfig.features, promotesCloud: false },
};

const cloudConfig: ClientConfig = {
	mode: "cloud",
	features: { readOnly: false, showOptimizeButton: false, canCreateBrands: true, billing: true },
	branding: { name: "Elmo", chartColors: DEFAULT_CHART_COLORS },
	analytics: {},
};

function applyConfig(config: ClientConfig) {
	setMockClientConfig(config);
	setMockRouteContext({ clientConfig: config });
}

export default {
	title: "Demo / Sign-up prompts",
	parameters: { layout: "fullscreen" },
} satisfies Meta;

export const Bar: StoryObj = {
	render: () => {
		applyConfig(demoConfig);
		return <DemoBar />;
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const link = await canvas.findByRole("link", { name: "Track Your Brand" });
		await expect(canvasElement).toHaveTextContent("This is a demo with sample data.");
		await expect(link).toHaveAttribute("href", "https://app.citerank.com/auth/register?ref=demo-header");
		await expect(link).toHaveAttribute("target", "_blank");
	},
};

export const NoBarOutsideDemo: StoryObj = {
	render: () => {
		applyConfig(cloudConfig);
		return <DemoBar />;
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeEmptyDOMElement();
	},
};

export const ReadOnlyRefusal: StoryObj = {
	render: () => {
		applyConfig(demoConfig);
		return (
			<UnsavedChangesBar isDirty isSaving={false} error={READ_ONLY_REFUSED} onSave={() => {}} onDiscard={() => {}} />
		);
	},
	play: async ({ canvasElement }) => {
		const alert = await within(canvasElement).findByRole("alert");
		await expect(alert).toHaveTextContent("The demo is read-only");
		const link = within(alert).getByRole("link", { name: "CiteRank.com" });
		await expect(link).toHaveAttribute("href", "https://app.citerank.com/auth/register?ref=demo-read-only");
	},
};

export const OtherSaveError: StoryObj = {
	render: () => {
		applyConfig(demoConfig);
		return (
			<UnsavedChangesBar
				isDirty
				isSaving={false}
				error="Failed to save prompts."
				onSave={() => {}}
				onDiscard={() => {}}
			/>
		);
	},
	play: async ({ canvasElement }) => {
		const alert = await within(canvasElement).findByRole("alert");
		await expect(alert).toHaveTextContent("Failed to save prompts.");
		await expect(within(alert).queryByRole("link")).toBeNull();
	},
};

export const ReadOnlySelfHost: StoryObj = {
	render: () => {
		applyConfig(readOnlySelfHostConfig);
		return (
			<>
				<DemoBar />
				<UnsavedChangesBar isDirty isSaving={false} error={READ_ONLY_REFUSED} onSave={() => {}} onDiscard={() => {}} />
			</>
		);
	},
	play: async ({ canvasElement }) => {
		const alert = await within(canvasElement).findByRole("alert");
		await expect(alert).toHaveTextContent(READ_ONLY_REFUSED);
		await expect(within(canvasElement).queryByRole("link")).toBeNull();
	},
};
