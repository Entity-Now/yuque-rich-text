declare global {
    interface Window {
        Doc: any;
    }
}
/**
 * Wait until Lake Doc runtime is available on the iframe window.
 */
export default function loadLakeEditor(win: Window & {
    Doc: any;
}): Promise<unknown>;
