export type {
	UploadResult,
	UploadParams,
	UploadConfig,
	EditorOptions,
	EditorCallbacks,
	IEditorRef,
} from "./types";
export { resolveUploadConfig } from "./types";
export { default as loadLakeEditor } from "./load";
export { InjectEditorPlugin } from "./editor-plugin";
export { templateHtml } from "./template";
export {
	mountLakeEditor,
	type LakeEditorInstance,
	type MountLakeEditorOptions,
} from "./create-lake-editor";
