import { h, defineComponent, type PropType } from "vue";
import LakeRich from "./lake-rich";
import type { UploadConfig, UploadParams, UploadResult } from "../core";

/**
 * Vue 3 read-only viewer for Lake documents.
 * Thin wrapper around YuqueRichText with `isview` forced to true.
 */
export default defineComponent({
	name: "YuqueRichTextView",
	props: {
		value: {
			type: String,
			default: "",
		},
		placeholder: {
			type: String,
			default: "",
		},
		defaultFontsize: {
			type: Number,
			default: 14,
		},
		upload: {
			type: Object as PropType<UploadConfig>,
			default: undefined,
		},
		imageUploadURL: {
			type: String,
			default: undefined,
		},
		imageCrawlURL: {
			type: String,
			default: undefined,
		},
		videoUploadURL: {
			type: String,
			default: undefined,
		},
		uploadImage: {
			type: Function as PropType<
				(params: UploadParams) => Promise<UploadResult>
			>,
			default: undefined,
		},
		uploadVideo: {
			type: Function as PropType<
				(params: UploadParams) => Promise<UploadResult>
			>,
			default: undefined,
		},
	},
	emits: ["onLoad"],
	setup(props, { emit, attrs }) {
		return () =>
			h(LakeRich, {
				...attrs,
				...props,
				isview: true,
				onOnLoad: () => emit("onLoad"),
			});
	},
});
