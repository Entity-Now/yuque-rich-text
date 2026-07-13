/**
 * yuque-rich-text
 *
 * Default entry re-exports the Vue 3 adapter for backward compatibility.
 * - Vue:  `import { YuqueRichText } from 'yuque-rich-text'` or `'yuque-rich-text/vue'`
 * - React: `import { LakeRich } from 'yuque-rich-text/react'`
 */
export { YuqueRichText, YuqueRichTextView } from './vue';
export { default } from './vue';
export type { IEditorRef, EditorProps, EditorEmits, UploadParams, UploadResult, UploadConfig, } from './vue';
export type { EditorOptions, EditorCallbacks } from './core';
