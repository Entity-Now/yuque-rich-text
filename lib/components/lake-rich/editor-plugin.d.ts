declare class IEditorPlugin {
    editor: any;
    init(): void;
}
declare class IKernelPlugin {
    kernel: any;
    init(kernel: any): void;
}
declare class IRendererPlugin {
    editor: any;
    init(): void;
}
declare class CommandClass {
    static UNAVAILABLE: string;
    static EXECUTED: string;
    static NOT_EXECUTED: string;
    static UNKNOWN: string;
    readonly kernel: any;
    readonly editing: any;
    destroy(): void;
    execute(editing: any, ...args: any[]): any;
    getValue(job: any, ...args: any[]): any;
}
export type IEditorPluginCls = new () => IEditorPlugin;
export type IKernelPluginCls = (new () => IKernelPlugin) & {
    PluginName: string;
};
export type IRendererPluginCls = new () => IRendererPlugin;
export type ICommandCls = new () => CommandClass;
export declare function InjectEditorPlugin({ EditorPlugin, KernelPlugin, PositionUtil, OpenEditorFactory, toolbarItems, Command, SelectionUtil }: {
    EditorPlugin: IEditorPluginCls;
    KernelPlugin: IKernelPluginCls;
    Plugins: Record<string, any>;
    Command: ICommandCls;
    SelectionUtil: any;
    PositionUtil: any;
    OpenEditorFactory: {
        editorPlugins: IEditorPluginCls[];
        kernelPlugins: IKernelPluginCls[];
        registerEditorPlugin: (plugins: IEditorPluginCls[]) => void;
        registerRenderPlugin: (plugins: IRendererPluginCls[]) => void;
        registerKernelPlugin: (plugins: IKernelPluginCls[]) => void;
    };
    toolbarItems: Record<string, string>;
}, doc: Document): void;
export {};
