<template>
  <div class="app">
    <div class="shell">
      <!-- Top bar -->
      <header class="topbar">
        <div class="brand">
          <span class="brand-mark" aria-hidden="true">语雀</span>
          <div class="brand-text">
            <h1>yuque-rich-text</h1>
            <p>Yuque Lake Editor · Vue 3 / React</p>
          </div>
        </div>

        <div class="topbar-actions">
          <div class="segmented" role="tablist" aria-label="Layout">
            <button
              type="button"
              :class="{ active: layout === 'split' }"
              @click="layout = 'split'"
            >
              Split
            </button>
            <button
              type="button"
              :class="{ active: layout === 'editor' }"
              @click="layout = 'editor'"
            >
              Editor
            </button>
            <button
              type="button"
              :class="{ active: layout === 'viewer' }"
              @click="layout = 'viewer'"
            >
              Viewer
            </button>
          </div>

          <a
            class="link-btn"
            href="https://github.com/Entity-Now/yuque-rich-text"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </div>
      </header>

      <!-- Toolbar -->
      <section class="toolbar card">
        <div class="toolbar-group">
          <button type="button" class="btn" @click="appendSample">
            Append
          </button>
          <button type="button" class="btn" @click="setSample">
            Set content
          </button>
          <button type="button" class="btn" @click="insertBreak">
            Break line
          </button>
          <button type="button" class="btn btn-primary" @click="showContent">
            Get content
          </button>
        </div>

        <div class="toolbar-meta">
          <span class="chip" :data-tone="loaded ? 'ok' : 'muted'">
            {{ loaded ? "Ready" : "Loading…" }}
          </span>
          <span class="chip">Words · {{ wordCount }}</span>
          <span class="chip">{{ isEmpty ? "Empty" : "Has content" }}</span>
        </div>
      </section>

      <!-- Upload config -->
      <section class="config card">
        <label class="field">
          <span>Image upload URL</span>
          <input v-model="imageUploadURL" type="text" spellcheck="false" />
        </label>
        <label class="field">
          <span>Video upload URL</span>
          <input v-model="videoUploadURL" type="text" spellcheck="false" />
        </label>
        <div class="config-actions">
          <button
            type="button"
            class="btn btn-primary"
            @click="applyUploadConfig"
          >
            Apply upload config
          </button>
          <p class="hint">
            Upload URLs apply at mount time. Click apply to remount the editor.
            Demo <code>uploadImage</code> logs to console and returns a placeholder.
          </p>
        </div>
      </section>

      <!-- Workspace -->
      <main class="workspace" :data-layout="layout">
        <section v-show="layout !== 'viewer'" class="panel card">
          <header class="panel-head">
            <div>
              <h2>Editor</h2>
              <p>WYSIWYG · Ctrl/Cmd + Enter to save</p>
            </div>
            <span class="badge">edit</span>
          </header>
          <div class="panel-body editor-body">
            <YuqueRichText
              :key="editorKey"
              ref="editRef"
              :value="documentValue"
              :upload="uploadConfig"
              :upload-image="uploadImage"
              @on-change="onEditorChange"
              @on-load="onEditorLoad"
              @on-save="onEditorSave"
            />
          </div>
        </section>

        <section v-show="layout !== 'editor'" class="panel card">
          <header class="panel-head">
            <div>
              <h2>Viewer</h2>
              <p>Read-only Lake preview</p>
            </div>
            <span class="badge badge-soft">view</span>
          </header>
          <div class="panel-body viewer-body">
            <YuqueRichTextView
              :key="`view-${editorKey}`"
              :value="documentValue"
              @on-load="viewerLoaded = true"
            />
          </div>
        </section>
      </main>

      <footer class="footer">
        <p>
          Based on
          <a
            href="https://github.com/yuque/yuque-chrome-extension"
            target="_blank"
            rel="noreferrer"
            >yuque-chrome-extension</a
          >. Unofficial · use at your own risk.
        </p>
      </footer>
    </div>

    <Transition name="toast">
      <div v-if="toast" class="toast" role="status">{{ toast }}</div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { YuqueRichText, YuqueRichTextView } from "yuque-rich-text";
import type { IEditorRef, UploadConfig, UploadResult } from "yuque-rich-text";

const editRef = ref<IEditorRef>();
const layout = ref<"split" | "editor" | "viewer">("split");

/** Shared document; core guards ignore echo updates from the editor itself. */
const documentValue = ref(
  `<h2>Welcome to yuque-rich-text</h2><p>这是一个基于语雀 Lake 的富文本编辑器 Demo。试试在左侧编辑，右侧实时预览。</p><ul><li>支持图片 / 视频上传 URL 配置</li><li>Vue 3 与 React 双端适配</li><li>Editor + Viewer 同构渲染</li></ul>`
);

const loaded = ref(false);
const viewerLoaded = ref(false);
const wordCount = ref(0);
const isEmpty = ref(false);
const toast = ref("");
const editorKey = ref(0);
let toastTimer: ReturnType<typeof setTimeout> | undefined;

const imageUploadURL = ref("/api/upload/image");
const videoUploadURL = ref("/api/upload/video");
const appliedImageURL = ref(imageUploadURL.value);
const appliedVideoURL = ref(videoUploadURL.value);

const uploadConfig = computed<UploadConfig>(() => ({
  imageUploadURL: appliedImageURL.value,
  imageCrawlURL: appliedImageURL.value,
  videoUploadURL: appliedVideoURL.value,
}));

const applyUploadConfig = () => {
  appliedImageURL.value = imageUploadURL.value.trim() || "/api/upload/image";
  appliedVideoURL.value = videoUploadURL.value.trim() || "/api/upload/video";
  loaded.value = false;
  editorKey.value += 1;
  flash("Upload config applied · editor remounting");
};

const uploadImage = async (params: {
  data: string | File;
}): Promise<UploadResult> => {
  console.info("[demo] uploadImage", params);
  const name =
    typeof params.data === "string"
      ? "pasted-image.png"
      : params.data.name || "image.png";
  return {
    url: "https://mdn.alipayobjects.com/huamei_0prmtq/afts/img/A*khyLSasB_7gAAAAAAAAAAAAADvuFAQFr/original",
    size:
      typeof params.data === "string" ? params.data.length : params.data.size,
    filename: name,
  };
};

const flash = (message: string) => {
  toast.value = message;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.value = "";
  }, 2200);
};

const refreshMeta = () => {
  wordCount.value = editRef.value?.wordCount() ?? 0;
  isEmpty.value = editRef.value?.isEmpty() ?? true;
};

const onEditorChange = (value: string) => {
  documentValue.value = value;
  refreshMeta();
};

const onEditorLoad = () => {
  loaded.value = true;
  refreshMeta();
  flash("Editor ready");
};

const onEditorSave = () => {
  const lake = editRef.value?.getContent("lake") ?? "";
  console.info("[demo] save", lake.slice(0, 200));
  flash("Saved (Ctrl/Cmd + Enter)");
};

const appendSample = () => {
  editRef.value?.appendContent(
    "<p><strong>追加段落</strong> · " +
      new Date().toLocaleTimeString() +
      "</p>",
    true
  );
  refreshMeta();
  flash("Appended content");
};

const setSample = () => {
  editRef.value?.setContent(
    "<h3>内容已重置</h3><p>通过 <code>setContent</code> 写入 HTML。</p>"
  );
  refreshMeta();
  flash("Content replaced");
};

const insertBreak = () => {
  editRef.value?.insertBreakLine();
  flash("Break line inserted");
};

const showContent = () => {
  const html = editRef.value?.getContent("text/html") ?? "";
  const preview = html.replace(/\s+/g, " ").slice(0, 180);
  flash(
    preview ? `HTML: ${preview}${html.length > 180 ? "…" : ""}` : "(empty)"
  );
  console.info("[demo] getContent", {
    lake: editRef.value?.getContent("lake"),
    html,
  });
};
</script>

<style scoped>
.app {
  --bg: #f5f6f8;
  --surface: #ffffff;
  --border: #e5e6eb;
  --border-strong: #d0d3d9;
  --text: #1f2329;
  --muted: #8f959e;
  --accent: #1677ff;
  --accent-soft: #e8f3ff;
  --ok: #00b42a;
  --ok-soft: #e8ffea;
  --radius: 12px;
  --shadow: 0 1px 2px rgba(0, 0, 0, 0.04), 0 4px 16px rgba(0, 0, 0, 0.04);

  min-height: 100vh;
  background: var(--bg);
  color: var(--text);
  text-align: left;
}

.shell {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 28px 40px 40px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-sizing: border-box;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  padding-bottom: 4px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-mark {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  font-weight: 700;
  font-size: 1rem;
  color: #fff;
  background: var(--accent);
}

.brand-text h1 {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--text);
}

.brand-text p {
  margin: 2px 0 0;
  color: var(--muted);
  font-size: 0.8125rem;
}

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.segmented {
  display: inline-flex;
  padding: 3px;
  border-radius: 8px;
  background: #eef0f3;
  border: 1px solid var(--border);
}

.segmented button {
  appearance: none;
  border: 0;
  background: transparent;
  color: var(--muted);
  font: inherit;
  font-size: 0.8125rem;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.15s ease;
}

.segmented button:hover {
  color: var(--text);
}

.segmented button.active {
  color: var(--text);
  background: var(--surface);
  font-weight: 600;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
}

.link-btn {
  display: inline-flex;
  align-items: center;
  height: 34px;
  padding: 0 12px;
  border-radius: 8px;
  border: 1px solid var(--border);
  color: var(--text);
  text-decoration: none;
  font-size: 0.8125rem;
  background: var(--surface);
  transition: border-color 0.15s ease, background 0.15s ease;
}

.link-btn:hover {
  border-color: var(--border-strong);
  background: #fafbfc;
  text-decoration: none;
}

.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  padding: 12px 16px;
}

.toolbar-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.toolbar-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.btn {
  appearance: none;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  font: inherit;
  font-size: 0.8125rem;
  padding: 7px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.15s ease;
}

.btn:hover {
  border-color: var(--border-strong);
  background: #fafbfc;
}

.btn-primary {
  border-color: var(--accent);
  color: #fff;
  background: var(--accent);
  font-weight: 500;
}

.btn-primary:hover {
  background: #4096ff;
  border-color: #4096ff;
}

.chip {
  display: inline-flex;
  align-items: center;
  height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  font-size: 0.75rem;
  color: var(--muted);
  background: #f5f6f8;
  border: 1px solid var(--border);
}

.chip[data-tone="ok"] {
  color: var(--ok);
  border-color: #b7eb8f;
  background: var(--ok-soft);
}

.config {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px 16px;
  padding: 16px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.field span {
  font-size: 0.75rem;
  color: var(--muted);
  font-weight: 500;
}

.field input {
  width: 100%;
  box-sizing: border-box;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: #fafbfc;
  color: var(--text);
  font: inherit;
  font-size: 0.875rem;
  padding: 9px 12px;
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.field input:hover {
  border-color: var(--border-strong);
}

.field input:focus {
  border-color: var(--accent);
  background: #fff;
  box-shadow: 0 0 0 3px rgba(22, 119, 255, 0.12);
}

.config-actions {
  grid-column: 1 / -1;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}

.hint {
  margin: 0;
  flex: 1;
  min-width: 220px;
  font-size: 0.8125rem;
  color: var(--muted);
  line-height: 1.45;
}

.hint code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 0.75rem;
  color: #595959;
  background: #f0f1f3;
  padding: 1px 5px;
  border-radius: 4px;
}

.workspace {
  flex: 1;
  min-height: 0;
  display: grid;
  gap: 16px;
}

.workspace[data-layout="split"] {
  grid-template-columns: repeat(2, minmax(0, 1fr));
  min-height: min(64vh, 720px);
}

.workspace[data-layout="editor"],
.workspace[data-layout="viewer"] {
  grid-template-columns: 1fr;
  min-height: min(70vh, 800px);
}

.panel {
  min-width: 0;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.panel-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  border-bottom: 1px solid var(--border);
  background: #fafbfc;
}

.panel-head h2 {
  margin: 0;
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--text);
}

.panel-head p {
  margin: 3px 0 0;
  color: var(--muted);
  font-size: 0.75rem;
}

.badge {
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 3px 8px;
  border-radius: 999px;
  color: var(--accent);
  background: var(--accent-soft);
  font-weight: 600;
}

.badge-soft {
  color: var(--muted);
  background: #f0f1f3;
  font-weight: 500;
}

.panel-body {
  flex: 1;
  min-height: 0;
  background: #fff;
}

.editor-body,
.viewer-body {
  position: relative;
}

.footer {
  color: var(--muted);
  font-size: 0.8125rem;
  text-align: center;
  padding-top: 4px;
}

.footer p {
  margin: 0;
}

.footer a {
  color: var(--accent);
}

.toast {
  position: fixed;
  left: 50%;
  bottom: 28px;
  transform: translateX(-50%);
  max-width: min(92vw, 480px);
  padding: 10px 16px;
  border-radius: 10px;
  background: #1f2329;
  color: #fff;
  font-size: 0.8125rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  z-index: 50;
}

.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, 8px);
}

@media (max-width: 960px) {
  .shell {
    padding: 20px 20px 28px;
  }

  .workspace[data-layout="split"] {
    grid-template-columns: 1fr;
    min-height: auto;
  }

  .config {
    grid-template-columns: 1fr;
  }

  .panel {
    min-height: 360px;
    height: 52vh;
  }
}

@media (max-width: 640px) {
  .shell {
    padding: 16px 16px 24px;
  }
}
</style>
