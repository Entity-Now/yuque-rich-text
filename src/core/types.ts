/**
 * Shared types for Yuque Rich Text editor (framework-agnostic).
 */

/** Result returned by custom upload handlers. */
export interface UploadResult {
	url: string;
	size: number;
	filename: string;
}

/** Parameters passed to custom upload handlers. */
export interface UploadParams {
	data: string | File;
}

/**
 * Upload configuration.
 * Prefer `uploadImage` / `uploadVideo` for full control;
 * use URL fields when the editor should POST to your backend.
 */
export interface UploadConfig {
	/**
	 * Image upload endpoint (used when `uploadImage` is not provided).
	 * @default '/api/upload/image'
	 */
	imageUploadURL?: string;
	/**
	 * Remote image crawl / proxy endpoint.
	 * @default same as `imageUploadURL`
	 */
	imageCrawlURL?: string;
	/**
	 * Video upload endpoint (used when `uploadVideo` is not provided).
	 * @default '/api/upload/video'
	 */
	videoUploadURL?: string;
	/** Custom image upload. Overrides URL-based image upload when set. */
	uploadImage?: (params: UploadParams) => Promise<UploadResult>;
	/** Custom video upload. Overrides URL-based video upload when set. */
	uploadVideo?: (params: UploadParams) => Promise<UploadResult>;
}

/** Editor / viewer public props (framework-agnostic shape). */
export interface EditorOptions {
	/** Document content (Lake format or HTML depending on usage). */
	value?: string;
	/** When true, renders read-only viewer instead of editor. */
	isview?: boolean;
	/** Placeholder text shown in empty editor. */
	placeholder?: string;
	/** Default font size in px. */
	defaultFontsize?: number;
	/** Nested upload configuration. */
	upload?: UploadConfig;
	/**
	 * Flat aliases (same as `upload.*`).
	 * Flat props take precedence over nested `upload` when both are set.
	 */
	imageUploadURL?: string;
	imageCrawlURL?: string;
	videoUploadURL?: string;
	uploadImage?: (params: UploadParams) => Promise<UploadResult>;
	uploadVideo?: (params: UploadParams) => Promise<UploadResult>;
}

/** Event callbacks. */
export interface EditorCallbacks {
	onChange?: (value: string) => void;
	onLoad?: () => void;
	onSave?: () => void;
}

/** Imperative API exposed via ref. */
export interface IEditorRef {
	/**
	 * Append HTML to the document.
	 * @param html HTML content
	 * @param breakLine Whether to insert a line break before content
	 */
	appendContent: (html: string, breakLine?: boolean) => void;
	/**
	 * Replace document content.
	 * @param content New content
	 * @param type Content MIME type
	 */
	setContent: (
		content: string,
		type?: "text/lake" | "text/html"
	) => void;
	/**
	 * Get document content.
	 * @param type Content format
	 */
	getContent: (type: "lake" | "text/html" | "description") => string;
	/** Whether the document is empty. */
	isEmpty: () => boolean;
	/** Summary content in Lake format. */
	getSummaryContent: () => string;
	/** Word count. */
	wordCount: () => number;
	/**
	 * Focus at document start.
	 * @param offset Paragraph offset from start (default 0)
	 */
	focusToStart: (offset?: number) => void;
	/** Insert a line break at current selection. */
	insertBreakLine: () => void;
}

/** Resolve flat + nested upload options into a single config. */
export function resolveUploadConfig(options: EditorOptions): Required<
	Pick<
		UploadConfig,
		"imageUploadURL" | "imageCrawlURL" | "videoUploadURL"
	>
> &
	Pick<UploadConfig, "uploadImage" | "uploadVideo"> {
	const nested = options.upload ?? {};
	const imageUploadURL =
		options.imageUploadURL ??
		nested.imageUploadURL ??
		"/api/upload/image";
	const imageCrawlURL =
		options.imageCrawlURL ??
		nested.imageCrawlURL ??
		imageUploadURL;
	const videoUploadURL =
		options.videoUploadURL ??
		nested.videoUploadURL ??
		"/api/upload/video";

	return {
		imageUploadURL,
		imageCrawlURL,
		videoUploadURL,
		uploadImage: options.uploadImage ?? nested.uploadImage,
		uploadVideo: options.uploadVideo ?? nested.uploadVideo,
	};
}
