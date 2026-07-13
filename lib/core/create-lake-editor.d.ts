import { templateHtml } from './template';
import { EditorCallbacks, EditorOptions, IEditorRef } from './types';
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
export declare function mountLakeEditor(iframe: HTMLIFrameElement, options: MountLakeEditorOptions): Promise<LakeEditorInstance>;
export { templateHtml };
