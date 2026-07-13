import React, {
	forwardRef,
	useEffect,
	useImperativeHandle,
	useRef,
	type CSSProperties,
} from "react";
import {
	mountLakeEditor,
	type IEditorRef,
	type LakeEditorInstance,
	type UploadConfig,
	type UploadParams,
	type UploadResult,
} from "../core";

export type { IEditorRef, UploadConfig, UploadParams, UploadResult };

export interface LakeRichProps {
	/** Document content. */
	value?: string;
	/** Read-only viewer mode. */
	isview?: boolean;
	/** Alias for `isview` (React-style naming). */
	isView?: boolean;
	placeholder?: string;
	defaultFontsize?: number;
	/** Nested upload configuration. */
	upload?: UploadConfig;
	imageUploadURL?: string;
	imageCrawlURL?: string;
	videoUploadURL?: string;
	uploadImage?: (params: UploadParams) => Promise<UploadResult>;
	uploadVideo?: (params: UploadParams) => Promise<UploadResult>;
	onChange?: (value: string) => void;
	onLoad?: () => void;
	onSave?: () => void;
	className?: string;
	style?: CSSProperties;
}

/**
 * React Yuque Lake rich-text editor / viewer.
 */
export const LakeRich = forwardRef<IEditorRef, LakeRichProps>(
	function LakeRich(props, ref) {
		const {
			value = "",
			isview,
			isView,
			placeholder = "输入内容...",
			defaultFontsize = 14,
			upload,
			imageUploadURL,
			imageCrawlURL,
			videoUploadURL,
			uploadImage,
			uploadVideo,
			onChange,
			onLoad,
			onSave,
			className = "lake-editor",
			style,
		} = props;

		const readOnly = isview ?? isView ?? false;
		const iframeRef = useRef<HTMLIFrameElement>(null);
		const instanceRef = useRef<LakeEditorInstance | null>(null);
		const callbacksRef = useRef({ onChange, onLoad, onSave });
		callbacksRef.current = { onChange, onLoad, onSave };

		useImperativeHandle(
			ref,
			(): IEditorRef => ({
				appendContent: (html, breakLine) =>
					instanceRef.current?.appendContent(html, breakLine),
				setContent: (content, type) =>
					instanceRef.current?.setContent(content, type),
				getContent: (type) =>
					instanceRef.current?.getContent(type) ?? "",
				isEmpty: () => instanceRef.current?.isEmpty() ?? true,
				getSummaryContent: () =>
					instanceRef.current?.getSummaryContent() ?? "",
				wordCount: () => instanceRef.current?.wordCount() ?? 0,
				focusToStart: (offset) =>
					instanceRef.current?.focusToStart(offset),
				insertBreakLine: () =>
					instanceRef.current?.insertBreakLine(),
			}),
			[]
		);

		// Mount once; upload handlers captured via refs would need remount for URL change
		useEffect(() => {
			const el = iframeRef.current;
			if (!el) return;

			let cancelled = false;

			mountLakeEditor(el, {
				value,
				isview: readOnly,
				placeholder,
				defaultFontsize,
				upload,
				imageUploadURL,
				imageCrawlURL,
				videoUploadURL,
				uploadImage,
				uploadVideo,
				onChange: (v) => callbacksRef.current.onChange?.(v),
				onLoad: () => callbacksRef.current.onLoad?.(),
				onSave: () => callbacksRef.current.onSave?.(),
			})
				.then((api) => {
					if (cancelled) {
						api.destroy();
						return;
					}
					instanceRef.current = api;
				})
				.catch((err) => {
					console.error(
						"[yuque-rich-text] failed to mount editor",
						err
					);
				});

			return () => {
				cancelled = true;
				instanceRef.current?.destroy();
				instanceRef.current = null;
			};
			// Intentionally mount once per isview mode; value synced below
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [readOnly]);

		useEffect(() => {
			instanceRef.current?.setValue(value ?? "");
		}, [value]);

		const mergedStyle: CSSProperties = {
			background: "transparent",
			border: "none",
			width: "100%",
			height: "100%",
			...style,
		};

		return (
			<iframe
				ref={iframeRef}
				className={className}
				// srcdoc is assigned in mountLakeEditor after the load listener is attached
				allow="*"
				style={mergedStyle}
				title="yuque-rich-text"
			/>
		);
	}
);

LakeRich.displayName = "LakeRich";

/** Read-only viewer. */
export const LakeRichView = forwardRef<
	IEditorRef,
	Omit<LakeRichProps, "isview" | "isView">
>(function LakeRichView(props, ref) {
	return <LakeRich {...props} ref={ref} isview />;
});

LakeRichView.displayName = "LakeRichView";

export default LakeRich;
