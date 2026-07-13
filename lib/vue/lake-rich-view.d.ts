import { PropType } from 'vue';
import { UploadConfig, UploadParams, UploadResult } from '../core';
/**
 * Vue 3 read-only viewer for Lake documents.
 * Thin wrapper around YuqueRichText with `isview` forced to true.
 */
declare const _default: import('vue').DefineComponent<import('vue').ExtractPropTypes<{
    value: {
        type: StringConstructor;
        default: string;
    };
    placeholder: {
        type: StringConstructor;
        default: string;
    };
    defaultFontsize: {
        type: NumberConstructor;
        default: number;
    };
    upload: {
        type: PropType<UploadConfig>;
        default: undefined;
    };
    imageUploadURL: {
        type: StringConstructor;
        default: undefined;
    };
    imageCrawlURL: {
        type: StringConstructor;
        default: undefined;
    };
    videoUploadURL: {
        type: StringConstructor;
        default: undefined;
    };
    uploadImage: {
        type: PropType<(params: UploadParams) => Promise<UploadResult>>;
        default: undefined;
    };
    uploadVideo: {
        type: PropType<(params: UploadParams) => Promise<UploadResult>>;
        default: undefined;
    };
}>, () => import('vue').VNode<import('vue').RendererNode, import('vue').RendererElement, {
    [key: string]: any;
}>, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, "onLoad"[], "onLoad", import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<{
    value: {
        type: StringConstructor;
        default: string;
    };
    placeholder: {
        type: StringConstructor;
        default: string;
    };
    defaultFontsize: {
        type: NumberConstructor;
        default: number;
    };
    upload: {
        type: PropType<UploadConfig>;
        default: undefined;
    };
    imageUploadURL: {
        type: StringConstructor;
        default: undefined;
    };
    imageCrawlURL: {
        type: StringConstructor;
        default: undefined;
    };
    videoUploadURL: {
        type: StringConstructor;
        default: undefined;
    };
    uploadImage: {
        type: PropType<(params: UploadParams) => Promise<UploadResult>>;
        default: undefined;
    };
    uploadVideo: {
        type: PropType<(params: UploadParams) => Promise<UploadResult>>;
        default: undefined;
    };
}>> & Readonly<{
    onOnLoad?: ((...args: any[]) => any) | undefined;
}>, {
    imageUploadURL: string;
    imageCrawlURL: string;
    videoUploadURL: string;
    uploadImage: (params: UploadParams) => Promise<UploadResult>;
    uploadVideo: (params: UploadParams) => Promise<UploadResult>;
    value: string;
    placeholder: string;
    defaultFontsize: number;
    upload: UploadConfig;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, true, {}, any>;
export default _default;
