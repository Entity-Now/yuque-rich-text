declare global {
    interface Window {
        Doc: any;
    }
}
export default function loadLakeEditor(win: Window & {
    Doc: any;
}): Promise<unknown>;
