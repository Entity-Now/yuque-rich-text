import { default as React, CSSProperties } from 'react';
import { IEditorRef, UploadConfig, UploadParams, UploadResult } from '../core';
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
export declare const LakeRich: React.ForwardRefExoticComponent<LakeRichProps & React.RefAttributes<IEditorRef>>;
/** Read-only viewer. */
export declare const LakeRichView: React.ForwardRefExoticComponent<Omit<LakeRichProps, "isview" | "isView"> & React.RefAttributes<IEditorRef>>;
export default LakeRich;
