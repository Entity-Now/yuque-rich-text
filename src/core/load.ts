declare global {
	interface Window {
		Doc: any;
	}
}

const LOAD_TIME_OUT = 10_000;

function isLakeEditorLoaded(win: Window & { Doc: any }) {
	return !!win.Doc;
}

/**
 * Wait until Lake Doc runtime is available on the iframe window.
 */
export default function loadLakeEditor(win: Window & { Doc: any }) {
	const start = Date.now();
	return new Promise((resolve, reject) => {
		if (isLakeEditorLoaded(win)) {
			resolve(win.Doc);
			return;
		}
		const load = () => {
			if (isLakeEditorLoaded(win)) {
				resolve(win.Doc);
			} else if (Date.now() - start > LOAD_TIME_OUT) {
				reject(new Error("load lake editor timeout"));
			} else {
				setTimeout(load, 100);
			}
		};
		setTimeout(load, 100);
	});
}
