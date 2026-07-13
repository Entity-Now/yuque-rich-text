import { templateHtml } from "./template";
import loadLakeEditor from "./load";
import { InjectEditorPlugin } from "./editor-plugin";
import {
	type EditorCallbacks,
	type EditorOptions,
	type IEditorRef,
	resolveUploadConfig,
} from "./types";

const blockquoteID = "yqextensionblockquoteid";

export type LakeEditorInstance = IEditorRef & {
	/** Underlying Lake editor / viewer instance. */
	getRawEditor: () => any;
	/** Tear down listeners and release resources. */
	destroy: () => void;
	/** Sync document when external value changes. */
	setValue: (value: string) => void;
};

export type MountLakeEditorOptions = EditorOptions & EditorCallbacks;

/**
 * Mount Yuque Lake editor / viewer into an iframe element.
 * Framework-agnostic; used by Vue and React adapters.
 */
export function mountLakeEditor(
	iframe: HTMLIFrameElement,
	options: MountLakeEditorOptions
): Promise<LakeEditorInstance> {
	return new Promise((resolve, reject) => {
		let destroyed = false;
		let editor: any = null;
		let internalUpdate = false;
		const isBrowser = typeof window !== "undefined";

		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Enter" && (isBrowser ? e.ctrlKey : e.metaKey)) {
				options.onSave?.();
			}
		};

		const cleanupLoad = () => {
			iframe.removeEventListener("load", loadFunc);
		};

		let loading = false;
		const loadFunc = () => {
			if (destroyed || loading || editor) return;
			loading = true;

			const doc = iframe.contentDocument;
			const win = iframe.contentWindow as (Window & { Doc: any }) | null;
			if (!doc || !win) {
				loading = false;
				reject(new Error("iframe document is not available"));
				return;
			}

			const { createOpenEditor, createOpenViewer } = win.Doc;
			InjectEditorPlugin(win.Doc, doc);

			loadLakeEditor(win)
				.then(() => {
					if (destroyed) return;

					const upload = resolveUploadConfig(options);
					const createInstance = options.isview
						? createOpenViewer
						: createOpenEditor;

					const imageOption: Record<string, unknown> = {
						uploadFileURL: upload.imageUploadURL,
						crawlURL: upload.imageCrawlURL,
					};
					if (upload.uploadImage) {
						imageOption.createUploadPromise = upload.uploadImage;
					}

					const videoOption: Record<string, unknown> = {
						uploadFileURL: upload.videoUploadURL,
					};
					if (upload.uploadVideo) {
						videoOption.createUploadPromise = upload.uploadVideo;
					}

					const newEditor = createInstance(doc.getElementById("root"), {
						scrollNode: () => doc.querySelector(".ne-editor-wrap"),
						image: imageOption,
						video: videoOption,
						placeholder: options.placeholder ?? "输入内容...",
						defaultFontsize: options.defaultFontsize ?? 14,
					});

					newEditor.on("visitLink", (url: string) => {
						window.open(url, "__blank");
					});

					if (!options.isview) {
						newEditor.on("contentchange", () => {
							internalUpdate = true;
							options.onChange?.(
								newEditor.getDocument("text/lake", {
									includeMeta: true,
								})
							);
							// Allow parent to process change before accepting external value sync
							queueMicrotask(() => {
								internalUpdate = false;
							});
						});
					}

					// @ts-expect-error debug handle on iframe window
					win.editor = newEditor;
					editor = newEditor;

					if (options.value) {
						newEditor.setDocument("lake", options.value);
						if (!options.isview) {
							newEditor.execCommand("paragraphSpacing", "relax");
						}
					}

					doc.addEventListener("keydown", onKeyDown, true);
					options.onLoad?.();

					const api: LakeEditorInstance = {
						getRawEditor: () => editor,
						setValue: (value: string) => {
							if (!editor || internalUpdate) return;
							const current = editor.getDocument("text/lake", {
								includeMeta: true,
							});
							if (value === current) return;
							editor.setDocument("lake", value ?? "");
							if (!options.isview) {
								editor.execCommand("paragraphSpacing", "relax");
							}
						},
						appendContent: (html: string, breakLine = false) => {
							if (!editor) return;
							if (breakLine) {
								editor.execCommand("breakLine");
							}
							editor.kernel.execCommand("insertHTML", html);
							iframe.focus();
							editor.execCommand("focus");
							editor.renderer?.scrollToCurrentSelection?.();
						},
						setContent: (
							content: string,
							type: "text/lake" | "text/html" = "text/html"
						) => {
							if (!editor) return;
							iframe.focus();
							editor.setDocument(type, content);
							editor.execCommand("focus", "end");
							const node =
								editor.kernel?.model?.document?.getNodeById?.(
									blockquoteID
								);
							if (node) {
								const rootNode =
									editor.kernel.model.document.rootNode;
								if (rootNode.firstNode === node) {
									return;
								}
								editor.kernel.execCommand("selection", {
									ranges: [
										{
											start: {
												node: rootNode.children[
													node.offset - 1
												],
												offset:
													rootNode.children[
														node.offset - 1
													].childCount,
											},
										},
									],
								});
								editor.execCommand("focus");
							}
						},
						isEmpty: () => {
							if (!editor) return true;
							return editor.queryCommandValue("isEmpty");
						},
						getContent: (
							type: "lake" | "text/html" | "description"
						) => {
							if (!editor) return "";
							if (type === "lake") {
								return editor.getDocument("text/lake", {
									includeMeta: true,
								});
							}
							if (type === "text/html") {
								return editor.getDocument("text/html");
							}
							return editor.getDocument("description");
						},
						getSummaryContent: () => {
							if (!editor) return "";
							return editor.queryCommandValue(
								"getSummary",
								"lake"
							);
						},
						wordCount: () => {
							if (!editor) return 0;
							return editor.queryCommandValue("wordCount");
						},
						focusToStart: (offset = 0) => {
							if (!editor) return;
							iframe.focus();
							if (offset) {
								editor.kernel.execCommand("selection", {
									ranges: [
										{
											start: {
												node: editor.kernel.model
													.document.rootNode
													.children[offset],
												offset: 0,
											},
										},
									],
								});
								editor.execCommand("focus");
							} else {
								editor.execCommand("focus", "start");
							}
						},
						insertBreakLine: () => {
							if (!editor) return;
							editor.execCommand("breakLine");
						},
						destroy: () => {
							destroyed = true;
							cleanupLoad();
							doc.removeEventListener(
								"keydown",
								onKeyDown,
								true
							);
							editor = null;
						},
					};

					resolve(api);
				})
				.catch((err) => {
					loading = false;
					reject(err);
				});
		};

		// Attach listener first, then set srcdoc so `load` always fires after.
		iframe.addEventListener("load", loadFunc);
		iframe.srcdoc = templateHtml;
	});
}

export { templateHtml };
