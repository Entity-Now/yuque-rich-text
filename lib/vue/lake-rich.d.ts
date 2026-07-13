import { PropType } from 'vue';
import { IEditorRef, UploadParams, UploadResult, UploadConfig } from '../core';
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
declare const _default: import('vue').DefineComponent<import('vue').ExtractPropTypes<{
    value: {
        type: StringConstructor;
        default: string;
    };
    isview: {
        type: BooleanConstructor;
        default: boolean;
    };
    placeholder: {
        type: StringConstructor;
        default: string;
    };
    defaultFontsize: {
        type: NumberConstructor;
        default: number;
    };
    /** Nested upload config object. */
    upload: {
        type: PropType<UploadConfig>;
        default: undefined;
    };
    /** Image upload endpoint URL. */
    imageUploadURL: {
        type: StringConstructor;
        default: undefined;
    };
    /** Remote image crawl endpoint URL. */
    imageCrawlURL: {
        type: StringConstructor;
        default: undefined;
    };
    /** Video upload endpoint URL. */
    videoUploadURL: {
        type: StringConstructor;
        default: undefined;
    };
    /** Custom image upload handler. */
    uploadImage: {
        type: PropType<(params: UploadParams) => Promise<UploadResult>>;
        default: undefined;
    };
    /** Custom video upload handler. */
    uploadVideo: {
        type: PropType<(params: UploadParams) => Promise<UploadResult>>;
        default: undefined;
    };
}>, () => import('vue').VNode<import('vue').RendererNode, import('vue').RendererElement, {
    [key: string]: any;
}>, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, ("onChange" | "onLoad" | "onSave" | "update:value")[], "onChange" | "onLoad" | "onSave" | "update:value", import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<{
    value: {
        type: StringConstructor;
        default: string;
    };
    isview: {
        type: BooleanConstructor;
        default: boolean;
    };
    placeholder: {
        type: StringConstructor;
        default: string;
    };
    defaultFontsize: {
        type: NumberConstructor;
        default: number;
    };
    /** Nested upload config object. */
    upload: {
        type: PropType<UploadConfig>;
        default: undefined;
    };
    /** Image upload endpoint URL. */
    imageUploadURL: {
        type: StringConstructor;
        default: undefined;
    };
    /** Remote image crawl endpoint URL. */
    imageCrawlURL: {
        type: StringConstructor;
        default: undefined;
    };
    /** Video upload endpoint URL. */
    videoUploadURL: {
        type: StringConstructor;
        default: undefined;
    };
    /** Custom image upload handler. */
    uploadImage: {
        type: PropType<(params: UploadParams) => Promise<UploadResult>>;
        default: undefined;
    };
    /** Custom video upload handler. */
    uploadVideo: {
        type: PropType<(params: UploadParams) => Promise<UploadResult>>;
        default: undefined;
    };
}>> & Readonly<{
    onOnChange?: ((...args: any[]) => any) | undefined;
    onOnLoad?: ((...args: any[]) => any) | undefined;
    onOnSave?: ((...args: any[]) => any) | undefined;
    "onUpdate:value"?: ((...args: any[]) => any) | undefined;
}>, {
    imageUploadURL: string;
    imageCrawlURL: string;
    videoUploadURL: string;
    uploadImage: (params: UploadParams) => Promise<UploadResult>;
    uploadVideo: (params: UploadParams) => Promise<UploadResult>;
    value: string;
    isview: boolean;
    placeholder: string;
    defaultFontsize: number;
    upload: UploadConfig;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, true, {}, any>;
export default _default;
