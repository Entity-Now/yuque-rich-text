---
title: expose-导出函数
createTime: 2025/07/04 10:00:11
permalink: /guide/m4i40b01/
---

## Expose 方法说明

通过 `ref` 引用 `YuqueRichText` 组件实例后，可以访问一系列暴露的方法（Expose API），用于操作编辑器内容、控制光标、获取摘要等。

## 引用方式

```ts
import { ref } from 'vue'
import type { IEditorRef } from 'yuque-rich-text'

const editorRef = ref<IEditorRef>()
```

```vue
<YuqueRichText ref="editorRef" :value="content" />
```

---

## 方法列表

| 方法名              | 参数说明                          | 返回值类型 | 说明 |
|---------------------|-----------------------------------|------------|------|
| `appendContent`     | `(html: string, breakLine?: boolean)` | `void`     | 向文档末尾追加 HTML 内容，可选是否添加换行。 |
| `setContent`        | `(content: string, type?: "text/lake" \| "text/html")` | `void` | 设置文档内容，清空旧内容。支持 lake 或 HTML 格式。 |
| `getContent`        | `(type: "lake" \| "text/html")`   | `string`   | 获取当前文档内容，返回指定格式的字符串。 |
| `isEmpty`           | `()`                              | `boolean`  | 判断当前文档是否为空。 |
| `getSummaryContent` | `()`                              | `string`   | 获取文档摘要内容（通常为首段或简要内容）。 |
| `wordCount`         | `()`                              | `number`   | 获取当前文档的字数统计。 |
| `focusToStart`      | `(offset?: number)`               | `void`     | 聚焦到文档开头，可指定段落偏移量。 |
| `insertBreakLine`   | `()`                              | `void`     | 插入一个换行符。 |

---

## 使用示例

### 追加内容

```ts
editorRef.value?.appendContent('<p>追加内容</p>', true)
```

### 设置内容

```ts
editorRef.value?.setContent('<p>新内容</p>', 'text/html')
```

### 获取内容

```ts
const html = editorRef.value?.getContent('text/html')
console.log('当前内容：', html)
```

### 判断是否为空

```ts
const empty = editorRef.value?.isEmpty()
console.log('是否为空文档：', empty)
```

### 获取摘要与字数

```ts
const summary = editorRef.value?.getSummaryContent()
const count = editorRef.value?.wordCount()
console.log('摘要：', summary)
console.log('字数：', count)
```

### 聚焦与换行

```ts
editorRef.value?.focusToStart(0)
editorRef.value?.insertBreakLine()
```
