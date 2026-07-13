import {
	ref,
	watch,
	h,
	onMounted,
	onUnmounted,
	defineComponent,
	type PropType,
} from "vue";
import {
	mountLakeEditor,
	type IEditorRef,
	type LakeEditorInstance,
	type UploadParams,
	type UploadResult,
	type UploadConfig,
} from "../core";

export type { IEditorRef, UploadParams, UploadResult, UploadConfig };

/** @deprecated Use EditorOptions field names; kept for README / type exports. */
export interface EditorProps {
	value: string;
	children?: any;
	isview?: boolean;
	placeholder?: string;
	defaultFontsize?: number;
	upload?: UploadConfig;
	imageUploadURL?: string;
	imageCrawlURL?: string;
	videoUploadURL?: string;
	uploadImage?: (params: UploadParams) => Promise<UploadResult>;
	uploadVideo?: (params: UploadParams) => Promise<UploadResult>;
}

export interface EditorEmits {
	onChange?: (value: string) => void;
	onLoad?: () => void;
	onSave?: () => void;
}

/**
 * Vue 3 Yuque Lake rich-text editor / viewer.
 */
export default defineComponent({
	name: "YuqueRichText",
	props: {
		value: {
			type: String,
			default: "",
		},
		isview: {
			type: Boolean,
			default: false,
		},
		placeholder: {
			type: String,
			default: "输入内容...",
		},
		defaultFontsize: {
			type: Number,
			default: 14,
		},
		/** Nested upload config object. */
		upload: {
			type: Object as PropType<UploadConfig>,
			default: undefined,
		},
		/** Image upload endpoint URL. */
		imageUploadURL: {
			type: String,
			default: undefined,
		},
		/** Remote image crawl endpoint URL. */
		imageCrawlURL: {
			type: String,
			default: undefined,
		},
		/** Video upload endpoint URL. */
		videoUploadURL: {
			type: String,
			default: undefined,
		},
		/** Custom image upload handler. */
		uploadImage: {
			type: Function as PropType<
				(params: UploadParams) => Promise<UploadResult>
			>,
			default: undefined,
		},
		/** Custom video upload handler. */
		uploadVideo: {
			type: Function as PropType<
				(params: UploadParams) => Promise<UploadResult>
			>,
			default: undefined,
		},
	},
	emits: ["onChange", "onLoad", "onSave", "update:value"],
	setup(props, { emit, expose }) {
		const iframeRef = ref<HTMLIFrameElement>();
		const instance = ref<LakeEditorInstance | null>(null);

		const buildApi = (): IEditorRef => ({
			appendContent: (html, breakLine) =>
				instance.value?.appendContent(html, breakLine),
			setContent: (content, type) =>
				instance.value?.setContent(content, type),
			getContent: (type) => instance.value?.getContent(type) ?? "",
			isEmpty: () => instance.value?.isEmpty() ?? true,
			getSummaryContent: () =>
				instance.value?.getSummaryContent() ?? "",
			wordCount: () => instance.value?.wordCount() ?? 0,
			focusToStart: (offset) =>
				instance.value?.focusToStart(offset),
			insertBreakLine: () => instance.value?.insertBreakLine(),
		});

		expose<IEditorRef>(buildApi());

		onMounted(() => {
			const el = iframeRef.value;
			if (!el) return;

			mountLakeEditor(el, {
				value: props.value,
				isview: props.isview,
				placeholder: props.placeholder,
				defaultFontsize: props.defaultFontsize,
				upload: props.upload,
				imageUploadURL: props.imageUploadURL,
				imageCrawlURL: props.imageCrawlURL,
				videoUploadURL: props.videoUploadURL,
				uploadImage: props.uploadImage,
				uploadVideo: props.uploadVideo,
				onChange: (value) => {
					emit("onChange", value);
					emit("update:value", value);
				},
				onLoad: () => emit("onLoad"),
				onSave: () => emit("onSave"),
			})
				.then((api) => {
					instance.value = api;
				})
				.catch((err) => {
					console.error("[yuque-rich-text] failed to mount editor", err);
				});
		});

		onUnmounted(() => {
			instance.value?.destroy();
			instance.value = null;
		});

		watch(
			() => props.value,
			(value) => {
				instance.value?.setValue(value ?? "");
			}
		);

		return () =>
			h("iframe", {
				ref: iframeRef,
				class: "lake-editor",
				height: "100%",
				width: "100%",
				// srcdoc is assigned in mountLakeEditor after the load listener is attached
				allow: "*",
				style: "background: transparent; border: none;",
			});
	},
});
