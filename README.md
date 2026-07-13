# yuque-rich-text

[![npm version](https://img.shields.io/npm/v/yuque-rich-text.svg)](https://www.npmjs.com/package/yuque-rich-text)
[![license](https://img.shields.io/npm/l/yuque-rich-text.svg)](./LICENSE)

**Yuque (语雀) Lake** rich-text **editor** and **viewer** for **Vue 3** and **React**.

Extracted from the official [yuque-chrome-extension](https://github.com/yuque/yuque-chrome-extension) so you can embed the same Lake editing experience in your own apps.

> **Unofficial third-party package.** Not affiliated with, maintained by, or endorsed by Yuque / 语雀.

---

## Table of Contents

- [Features](#features)
- [Screenshots](#screenshots)
- [Installation](#installation)
- [Prerequisites (CDN assets)](#prerequisites-cdn-assets)
- [Quick Start](#quick-start)
  - [Vue 3](#vue-3)
  - [React](#react)
- [Upload configuration](#upload-configuration)
- [API Reference](#api-reference)
  - [Props](#props)
  - [Events / Callbacks](#events--callbacks)
  - [Imperative API (`ref`)](#imperative-api-ref)
- [Viewer mode](#viewer-mode)
- [Package exports](#package-exports)
- [Development](#development)
- [Disclaimer](#disclaimer)
- [License](#license)

---

## Features

| Feature | Description |
| --- | --- |
| **Vue 3 & React** | First-class adapters with a shared core |
| **Editor + Viewer** | Full WYSIWYG editing or read-only preview |
| **Configurable upload** | Custom **upload URLs** and/or **upload callbacks** for image & video |
| **Lake format** | Native Yuque Lake document format + HTML interop |
| **Imperative API** | `setContent` / `getContent` / `appendContent` / `wordCount` / … |
| **Iframe isolation** | Editor runs in a sandboxed iframe with Lake runtime |

---

## Screenshots

![Component demo](https://github.com/Entity-Now/yuque-rich-text/blob/master/public/Images/yuque-rich-text.gif)

---

## Installation

```bash
# npm
npm install yuque-rich-text

# pnpm
pnpm add yuque-rich-text

# yarn
yarn add yuque-rich-text
```

**Peer dependencies** (install what you use):

```bash
# Vue 3
npm install vue@^3

# React
npm install react react-dom
```

---

## Prerequisites (CDN assets)

Lake depends on global scripts/styles. Include them in your host HTML (or inject equivalently at runtime).

### Styles (`<head>`)

```html
<link
  rel="stylesheet"
  type="text/css"
  href="https://gw.alipayobjects.com/render/p/yuyan_npm/@alipay_lakex-doc/1.71.0/umd/doc.css"
/>
<link
  rel="stylesheet"
  type="text/css"
  href="https://gw.alipayobjects.com/os/lib/antd/4.24.13/dist/antd.css"
/>
```

### Scripts (before app bootstrap, typically end of `<body>`)

```html
<script crossorigin src="https://unpkg.com/react@18.2.0/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18.2.0/umd/react-dom.production.min.js"></script>
<script src="https://gw.alipayobjects.com/render/p/yuyan_v/180020010000005484/7.1.4/CodeMirror.js"></script>
<script src="https://ur.alipay.com/tracert_a385.js"></script>
<script src="https://mdn.alipayobjects.com/design_kitchencore/afts/file/ANSZQ7GHQPMAAAAAAAAAAAAADhulAQBr"></script>
<script src="https://gw.alipayobjects.com/render/p/yuyan_npm/@alipay_lakex-doc/1.71.0/umd/doc.umd.js"></script>
```

> The editor iframe also loads these assets via its internal template. Host-page inclusion is still recommended for consistent global `Doc` availability in some environments.

---

## Quick Start

### Vue 3

```vue
<template>
  <div class="editor-wrap">
    <YuqueRichText
      ref="editorRef"
      :value="content"
      :image-upload-u-r-l="imageUploadURL"
      :video-upload-u-r-l="videoUploadURL"
      :upload-image="uploadImage"
      @on-change="onChange"
      @on-load="onLoad"
      @on-save="onSave"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { YuqueRichText } from "yuque-rich-text";
// or: import { YuqueRichText } from 'yuque-rich-text/vue'
import type { IEditorRef } from "yuque-rich-text";

const editorRef = ref<IEditorRef>();
const content = ref("<p>Hello Lake</p>");

/** Prefer kebab for multi-cap props, or use camelCase in script-bound objects */
const imageUploadURL = "/api/v1/upload/image";
const videoUploadURL = "/api/v1/upload/video";

const uploadImage = async (params: { data: string | File }) => {
  const form = new FormData();
  form.append("file", params.data);
  const res = await fetch(imageUploadURL, { method: "POST", body: form });
  const json = await res.json();
  return {
    url: json.url,
    size: json.size ?? 0,
    filename: json.filename ?? "image.png",
  };
};

const onChange = (value: string) => {
  // Do NOT write back into `content` from onChange with the same binding
  // if you also pass `:value="content"` without guards — that can loop.
  console.log("change", value);
};

const onLoad = () => {
  editorRef.value?.focusToStart();
};

const onSave = () => {
  // Ctrl/Cmd + Enter
  console.log(editorRef.value?.getContent("lake"));
};
</script>

<style scoped>
.editor-wrap {
  height: 480px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}
</style>
```

> **Tip:** Vue prop names like `imageUploadURL` are exposed as `image-upload-u-r-l` in templates. You can also pass a nested `upload` object to avoid awkward kebab names (see [Upload configuration](#upload-configuration)).

Using nested `upload` (recommended in Vue templates):

```vue
<YuqueRichText
  ref="editorRef"
  :value="content"
  :upload="{
    imageUploadURL: '/api/v1/upload/image',
    videoUploadURL: '/api/v1/upload/video',
    uploadImage,
  }"
  @on-change="onChange"
/>
```

### React

```tsx
import { useRef, useState } from "react";
import { LakeRich, type IEditorRef } from "yuque-rich-text/react";

export function DocEditor() {
  const editorRef = useRef<IEditorRef>(null);
  const [value, setValue] = useState("<p>Hello Lake</p>");

  return (
    <div style={{ height: 480 }}>
      <LakeRich
        ref={editorRef}
        value={value}
        imageUploadURL="/api/v1/upload/image"
        videoUploadURL="/api/v1/upload/video"
        uploadImage={async ({ data }) => {
          const form = new FormData();
          form.append("file", data);
          const res = await fetch("/api/v1/upload/image", {
            method: "POST",
            body: form,
          });
          const json = await res.json();
          return {
            url: json.url,
            size: json.size ?? 0,
            filename: json.filename ?? "image.png",
          };
        }}
        onChange={setValue}
        onLoad={() => editorRef.current?.focusToStart()}
        onSave={() => {
          console.log(editorRef.current?.getContent("lake"));
        }}
      />
    </div>
  );
}
```

---

## Upload configuration

Previously the editor hard-coded `/api/upload/image` and `/api/upload/video`. You can now configure **URLs** and/or **custom upload functions**.

### Option A — Upload URLs only

Lake will POST to your endpoints using its built-in uploader:

```ts
{
  imageUploadURL: "https://your.cdn.example/upload/image",
  imageCrawlURL: "https://your.cdn.example/crawl/image", // optional; defaults to imageUploadURL
  videoUploadURL: "https://your.cdn.example/upload/video",
}
```

### Option B — Custom upload callbacks

Full control over auth headers, form fields, response mapping:

```ts
async function uploadImage(params: { data: string | File }) {
  // params.data is File | base64 string depending on Lake path
  const res = await yourUploader(params.data);
  return {
    url: res.publicUrl,
    size: res.bytes,
    filename: res.name,
  };
}
```

When `uploadImage` / `uploadVideo` is provided, it is passed to Lake as `createUploadPromise` and takes precedence for the upload pipeline.

### Option C — Nested `upload` object

```ts
const upload = {
  imageUploadURL: "/api/upload/image",
  imageCrawlURL: "/api/upload/crawl",
  videoUploadURL: "/api/upload/video",
  uploadImage: async ({ data }) => { /* ... */ },
  uploadVideo: async ({ data }) => { /* ... */ },
};
```

**Precedence:** flat props (`imageUploadURL`, `uploadImage`, …) override the same keys inside `upload`.

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `imageUploadURL` | `string` | `/api/upload/image` | Image upload endpoint |
| `imageCrawlURL` | `string` | same as `imageUploadURL` | Remote image crawl / proxy |
| `videoUploadURL` | `string` | `/api/upload/video` | Video upload endpoint |
| `uploadImage` | `(params) => Promise<UploadResult>` | — | Custom image uploader |
| `uploadVideo` | `(params) => Promise<UploadResult>` | — | Custom video uploader |

```ts
interface UploadResult {
  url: string;
  size: number;
  filename: string;
}
```

---

## API Reference

### Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | `''` | Document content (Lake / HTML as accepted by Lake) |
| `isview` | `boolean` | `false` | `true` → read-only viewer |
| `isView` | `boolean` | — | React-only alias of `isview` |
| `placeholder` | `string` | `'输入内容...'` | Empty-editor placeholder |
| `defaultFontsize` | `number` | `14` | Default font size (px) |
| `upload` | `UploadConfig` | — | Nested upload config |
| `imageUploadURL` | `string` | see above | Image upload URL |
| `imageCrawlURL` | `string` | see above | Image crawl URL |
| `videoUploadURL` | `string` | see above | Video upload URL |
| `uploadImage` | `function` | — | Custom image upload |
| `uploadVideo` | `function` | — | Custom video upload |

### Events / Callbacks

| Name | Payload | Description |
| --- | --- | --- |
| `onChange` | `(value: string)` | Content changed (Lake string with meta) |
| `onLoad` | `()` | Editor / viewer ready |
| `onSave` | `()` | `Ctrl+Enter` (Windows/Linux) or `Cmd+Enter` (macOS*) |

\*Save chord follows the original extension behavior.

Vue also emits `update:value` for optional `v-model:value` usage. Avoid uncontrolled two-way binding loops: if you bind both `:value` and `@onChange` that immediately writes the same source, guard with equality checks.

### Imperative API (`ref`)

```ts
interface IEditorRef {
  appendContent: (html: string, breakLine?: boolean) => void;
  setContent: (content: string, type?: "text/lake" | "text/html") => void;
  getContent: (type: "lake" | "text/html" | "description") => string;
  isEmpty: () => boolean;
  getSummaryContent: () => string;
  wordCount: () => number;
  focusToStart: (offset?: number) => void;
  insertBreakLine: () => void;
}
```

| Method | Description |
| --- | --- |
| `appendContent(html, breakLine?)` | Append HTML; optional leading break |
| `setContent(content, type?)` | Replace document (`text/html` default) |
| `getContent(type)` | Read content as Lake / HTML / description |
| `isEmpty()` | Whether document is empty |
| `getSummaryContent()` | Summary in Lake format |
| `wordCount()` | Word count |
| `focusToStart(offset?)` | Focus start (optional paragraph offset) |
| `insertBreakLine()` | Insert line break at selection |

Call imperative methods **after** `onLoad`.

---

## Viewer mode

### Vue

```vue
<script setup lang="ts">
import { YuqueRichText, YuqueRichTextView } from "yuque-rich-text";
</script>

<template>
  <!-- Option 1 -->
  <YuqueRichText :isview="true" :value="htmlOrLake" />

  <!-- Option 2: dedicated viewer component -->
  <YuqueRichTextView :value="htmlOrLake" />
</template>
```

### React

```tsx
import { LakeRich, LakeRichView } from "yuque-rich-text/react";

<LakeRich isView value={content} />
// or
<LakeRichView value={content} />
```

---

## Package exports

| Subpath | Framework | Primary symbols |
| --- | --- | --- |
| `yuque-rich-text` | Vue 3 (default, backward compatible) | `YuqueRichText`, `YuqueRichTextView` |
| `yuque-rich-text/vue` | Vue 3 | same as default |
| `yuque-rich-text/react` | React | `LakeRich`, `LakeRichView` |

Shared types (`IEditorRef`, `UploadConfig`, …) are re-exported from each entry.

---

## Development

```bash
# install
pnpm install   # or npm install

# local demo
pnpm dev

# library build → ./lib
pnpm build:lib

# static demo build
pnpm build:demo
```

### Project layout

```
src/
  core/           # Framework-agnostic Lake mount + types
  vue/            # Vue 3 adapter
  react/          # React adapter
  components/     # Legacy paths (re-exports)
demo/             # Vite playground
```

---

## Disclaimer

This is an **unofficial third-party** integration for [Yuque](https://www.yuque.com). It is **not** affiliated with, maintained by, or endorsed by Yuque.

- **Use at your own risk.** Authors are not responsible for ToS violations or damages.
- Do **not** use if Yuque prohibits this usage in your context.
- This project does not redistribute Yuque’s proprietary application source; it loads publicly referenced Lake runtime assets in the same manner as the open-source browser extension.

Please review [Yuque’s Terms of Service](https://www.yuque.com) before production use.

---

## License

MIT

---

## Credits

- [yuque-chrome-extension](https://github.com/yuque/yuque-chrome-extension) — original editor integration
- Lake / lakex-doc runtime — Alipay / Yuque ecosystem
