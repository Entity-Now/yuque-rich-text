import path from "path";
import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";

const libDir = path.resolve(__dirname, "lib");
const srcDir = path.resolve(__dirname, "src");

// https://vite.dev/config/
export default ({ mode }: { mode: string }) => {
	process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

	const IS_DEMO =
		process.env.VITE_BUILD_TARGET === "demo" || mode === "demo";

	return defineConfig({
		plugins: [
			vue(),
			IS_DEMO
				? null
				: dts({
						include: ["src"],
						insertTypesEntry: true,
						outDir: libDir,
						rollupTypes: false,
					}),
		].filter(Boolean),
		resolve: {
			alias: [
				{
					find: "@",
					replacement: path.resolve(__dirname, "src"),
				},
				{
					find: "demo",
					replacement: path.resolve(__dirname, "demo"),
				},
				{
					find: "yuque-rich-text",
					replacement: path.resolve(__dirname, "src/index.ts"),
				},
			],
		},
		esbuild: {
			jsx: "automatic",
			jsxImportSource: "react",
		},
		build: IS_DEMO
			? undefined
			: {
					outDir: libDir,
					emptyOutDir: true,
					copyPublicDir: false,
					minify: "esbuild",
					lib: {
						entry: {
							index: path.resolve(srcDir, "index.ts"),
							vue: path.resolve(srcDir, "vue/index.ts"),
							react: path.resolve(srcDir, "react/index.ts"),
						},
						// Multi-entry lib builds only support ES modules cleanly
						formats: ["es"],
						fileName: (_format, entryName) => `${entryName}.js`,
					},
					rollupOptions: {
						external: [
							"vue",
							"react",
							"react-dom",
							"react/jsx-runtime",
						],
						output: {
							exports: "named",
						},
					},
				},
	});
};
