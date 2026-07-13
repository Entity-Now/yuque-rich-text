<script setup lang="ts">
/**
 * @deprecated Prefer `YuqueRichTextView` from `yuque-rich-text` / `yuque-rich-text/vue`.
 * This SFC is kept as a thin alias for existing imports.
 */
import { YuqueRichTextView } from "../../vue";
import type { UploadConfig, UploadParams, UploadResult } from "../../core";

const props = defineProps<{
	value?: string;
	placeholder?: string;
	defaultFontsize?: number;
	upload?: UploadConfig;
	imageUploadURL?: string;
	imageCrawlURL?: string;
	videoUploadURL?: string;
	uploadImage?: (params: UploadParams) => Promise<UploadResult>;
	uploadVideo?: (params: UploadParams) => Promise<UploadResult>;
}>();

const emit = defineEmits<{
	onLoad: [];
}>();
</script>

<template>
	<YuqueRichTextView
		:value="props.value"
		:placeholder="props.placeholder"
		:defaultFontsize="props.defaultFontsize"
		:upload="props.upload"
		:imageUploadURL="props.imageUploadURL"
		:imageCrawlURL="props.imageCrawlURL"
		:videoUploadURL="props.videoUploadURL"
		:uploadImage="props.uploadImage"
		:uploadVideo="props.uploadVideo"
		@onLoad="emit('onLoad')"
	/>
</template>
