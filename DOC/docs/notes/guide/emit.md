---
title: 事件
createTime: 2025/07/04 09:58:57
permalink: /guide/jz5kueb9/
---

## Emits 事件说明

`YuqueRichText` 组件在运行过程中会触发以下事件，开发者可以通过监听这些事件来实现内容同步、状态监控等功能。

## 事件列表

| 事件名     | 回调参数         | 说明 |
|------------|------------------|------|
| `onChange` | `(value: string)` | 当编辑器内容发生变化时触发，返回当前内容（HTML 格式）。 |
| `onLoad`   | `()`              | 编辑器加载完成后触发，适合在此时进行初始化操作。 |
| `onSave`   | `()`              | 当用户触发保存操作时触发（如支持快捷键或按钮保存时）。 |

---

## 事件使用示例

### 监听内容变化

```vue
<YuqueRichText
  :value="content"
  @onChange="handleChange"
/>

<script setup lang="ts">
const handleChange = (val: string) => {
  console.log('编辑器内容变更：', val)
}
</script>
```

### 监听加载完成

```vue
<YuqueRichText
  :value="content"
  @onLoad="handleLoad"
/>

<script setup lang="ts">
const handleLoad = () => {
  console.log('编辑器已加载完成')
}
</script>
```

### 监听保存事件（如支持）

```vue
<YuqueRichText
  :value="content"
  @onSave="handleSave"
/>

<script setup lang="ts">
const handleSave = () => {
  console.log('用户触发了保存操作')
}
</script>
```