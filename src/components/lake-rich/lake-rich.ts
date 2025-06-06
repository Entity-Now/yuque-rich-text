import { ref, watch, h, onMounted, onUnmounted, defineComponent } from "vue";
import { templateHtml } from "./template";
import loadLakeEditor from "./load";
import { InjectEditorPlugin } from "./editor-plugin";
import { slash } from "./slash-options";

const blockquoteID = "yqextensionblockquoteid";
export interface EditorProps {
	value: string;
	children?: any;
	isview?: boolean;
	uploadImage?: (params: { data: string | File }) => Promise<{
		url: string;
		size: number;
		filename: string;
	}>;
	uploadVideo?: (params: { data: string | File }) => Promise<{
		url: string;
		size: number;
		filename: string;
	}>;
}
export interface EditorEmits {
	onChange?: (value: string) => void;
	onLoad?: () => void;
	onSave?: () => void;
}

function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export interface IEditorRef {
	/**
	 * 追加html到文档
	 * @param html html内容
	 * @param breakLine 是否前置一个换行符
	 */
	appendContent: (html: string, breakLine?: boolean) => void;
	/**
	 * 设置文档内容，将清空旧的内容
	 * @param html html内容
	 */
	setContent: (content: string, type?: "text/lake" | "text/html") => void;
	/**
	 * 获取文档内容
	 * @param type 内容的格式
	 * @return 文档内容
	 */
	getContent: (type: "lake" | "text/html") => string;
	/**
	 * 判断当前文档是否是空文档
	 * @return true表示当前是空文档
	 */
	isEmpty: () => boolean;

	/**
	 * 获取额外信息
	 * @return
	 */
	getSummaryContent: () => string;

	/**
	 * 统计字数
	 * @return
	 */
	wordCount: () => number;

	/**
	 * 聚焦到文档开头
	 * @param {number} offset 偏移多少个段落，可以将选区落到开头的第offset个段落上, 默认是0
	 * @return
	 */
	focusToStart: (offset?: number) => void;

	/**
	 * 插入换行符
	 * @return
	 */
	insertBreakLine: () => void;
}

export default defineComponent({
	props: {
		value: {
			type: String,
			default: "",
		},
		isview: {
			type: Boolean,
			default: false,
			required: false,
		},
	},
	emits: ["onChange", "onLoad", "onSave", "uploadImage"],
	setup(props: EditorProps, { emit, expose }) {
		const isBrowser = typeof window !== "undefined";
		const iframeRef = ref<HTMLIFrameElement>();
		const editor = ref<any>();
		const unLoad = ref();
		const loadLake = () => {
			function loadFunc() {
				const doc = iframeRef.value?.contentDocument;
				const win = iframeRef.value?.contentWindow;
				if (!doc || !win) {
					return;
				}
				const { createOpenEditor, createOpenViewer } = win.Doc;
				// 注入插件
				InjectEditorPlugin(win.Doc, doc);
				// 加载编辑器
				loadLakeEditor(win).then(() => {
					// 创建编辑器
					let editInstance = props.isview
						? createOpenViewer
						: createOpenEditor;
					const newEditor = editInstance(doc.getElementById("root"), {
						scrollNode: () => {
							return doc.querySelector(".ne-editor-wrap");
						},
						image: {
							uploadFileURL: "/api/upload/image",
							crawlURL: "/api/upload/image",
							createUploadPromise: props.uploadImage,
						},
						video: {
							uploadFileURL: "/api/upload/video",
							createUploadPromise: props.uploadVideo,
						},
						placeholder: "输入内容...",
						defaultFontsize: 14,
					});
					newEditor.on("visitLink", (url: string) => {
						window.open(url, "__blank");
					});
					// 监听内容变动
					newEditor.on("contentchange", () => {
						emit("onChange", newEditor.getDocument("lake"));
					});
					// @ts-expect-error 注入调试变量
					win.editor = newEditor;
					// 设置编辑器到状态
					editor.value = newEditor;
				});
			}
			iframeRef.value?.addEventListener("load", loadFunc);
			return () => {
				iframeRef.value?.removeEventListener("load", loadFunc);
			};
		};
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Enter" && (isBrowser ? e.ctrlKey : e.metaKey)) {
				emit("onSave");
			}
		};
		watch(
			[() => props.value, () => editor.value],
			([value, edit], [oldValue, oldEdit]) => {
				if (!editor.value) return;

				editor.value?.setDocument("lake", props.value);
				editor.value?.execCommand("paragraphSpacing", "relax");
				emit("onLoad");
			}
		);
		watch([() => editor.value, () => iframeRef.value], (input) => {
			if (!editor.value || !iframeRef.value) return;
			iframeRef.value?.contentDocument?.addEventListener(
				"keydown",
				onKeyDown,
				true
			);
		});
		expose<IEditorRef>({
			appendContent: (html: string, breakLine = false) => {
				if (!editor.value) return;
				if (breakLine) {
					editor.value.execCommand("breakLine");
				}
				editor.value.kernel.execCommand("insertHTML", html);
				iframeRef.value?.focus();
				editor.value.execCommand("focus");
				editor.value.renderer.scrollToCurrentSelection();
			},
			setContent: (
				content: string,
				type: "text/lake" | "text/html" = "text/html"
			) => {
				if (!editor.value) return;
				iframeRef.value?.focus();
				editor.value.setDocument(type, content);
				editor.value.execCommand("focus", "end");
				// 寻找定位的block 插入到block上方
				const node =
					editor.value.kernel.model.document.getNodeById(
						blockquoteID
					);
				if (node) {
					const rootNode =
						editor.value.kernel.model.document.rootNode;
					if (rootNode.firstNode === node) {
						return;
					}
					editor.value.kernel.execCommand("selection", {
						ranges: [
							{
								start: {
									node: rootNode.children[node.offset - 1],
									offset: rootNode.children[node.offset - 1]
										.childCount,
								},
							},
						],
					});
					editor.value.execCommand("focus");
				}
			},
			isEmpty: () => {
				if (!editor) return true;
				return editor.value.queryCommandValue("isEmpty");
			},
			getContent: (type: "lake" | "text/html" | "description") => {
				if (!editor.value) return "";
				// let times = 0;
				// while (!editor.value.canGetDocument()) {
				//   // 10s 后返回超时
				//   if (times > 100) {
				// 	throw new Error('文档上传未结束! 请删除未上传成功的图片');
				//   }
				//   times++;
				//   await sleep(100);
				// }
				if (type === "lake") {
					return editor.value.getDocument("text/lake", {
						includeMeta: true,
					});
				} else if (type === "text/html") {
					return editor.value.getDocument("text/html");
				}
				return editor.value.getDocument("description");
			},
			getSummaryContent: () => {
				if (!editor) return "";
				return editor.value.queryCommandValue("getSummary", "lake");
			},
			wordCount: () => {
				if (!editor) return 0;
				return editor.value.queryCommandValue("wordCount");
			},
			focusToStart: (offset = 0) => {
				if (!editor) return;
				iframeRef.value?.focus();
				if (offset) {
					editor.value.kernel.execCommand("selection", {
						ranges: [
							{
								start: {
									node: editor.value.kernel.model.document
										.rootNode.children[offset],
									offset: 0,
								},
							},
						],
					});
					editor.value.execCommand("focus");
				} else {
					editor.value.execCommand("focus", "start");
				}
			},
			insertBreakLine: () => {
				if (!editor) return;
				editor.value.execCommand("breakLine");
			},
		});
		onMounted(() => {
			unLoad.value = loadLake();
		});
		onUnmounted(() => {
			unLoad.value?.();
			iframeRef.value?.contentDocument?.removeEventListener(
				"keydown",
				onKeyDown,
				true
			);
		});
		return () =>
			h("iframe", {
				ref: iframeRef,
				class: "lake-editor",
				height: "100%",
				width: "100%",
				srcDoc: templateHtml,
				allow: "*",
				style: "background: transparent; border: none;",
			});
	},
});
