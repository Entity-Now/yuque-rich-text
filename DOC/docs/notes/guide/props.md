---
title: props
createTime: 2025/07/04 09:58:05
permalink: /guide/e4mt6sp6/
---

## Props 属性说明

`YuqueRichText` 是一个基于 Vue 3 的富文本编辑器组件，支持编辑与预览两种模式。以下是该组件支持的 Props 属性说明：

## 基础属性

| 属性名       | 类型                     | 是否必填 | 默认值   | 说明 |
|--------------|--------------------------|----------|----------|------|
| `value`      | `string`                 | ✅ 是     | `''`     | 编辑器的初始内容，支持 HTML 格式。 |
| `isview`     | `boolean`                | ❌ 否     | `false`  | 是否为只读预览模式。为 `true` 时不可编辑。 |
| `children`   | `any`                    | ❌ 否     | `undefined` | 预留属性，当前未实现。 |

## 上传相关属性

| 属性名         | 类型                                                                 | 是否必填 | 默认值 | 说明 |
|----------------|----------------------------------------------------------------------|----------|--------|------|
| `uploadImage`  | `(params: { data: File \| string }) => Promise<{ url: string; size: number; filename: string }>` | ❌ 否     | 无     | 自定义图片上传逻辑。接收文件或 base64 字符串，返回上传后的图片信息。 |
| `uploadVideo`  | `(params: { data: File \| string }) => Promise<{ url: string; size: number; filename: string }>` | ❌ 否     | 无     | 自定义视频上传逻辑。接收文件或 base64 字符串，返回上传后的视频信息。 |

### 示例：上传图片逻辑

```ts
const uploadImage = async ({ data }: { data: File | string }) => {
  // 模拟上传逻辑
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return {
    url: 'https://example.com/image.png',
    size: 123456,
    filename: typeof data === 'string' ? 'image.png' : data.name,
  };
};
```

### 示例：上传视频逻辑

```ts
const uploadVideo = async ({ data }: { data: File | string }) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return {
    url: 'https://example.com/video.mp4',
    size: 987654,
    filename: typeof data === 'string' ? 'video.mp4' : data.name,
  };
};
```
