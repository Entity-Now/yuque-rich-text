<template>
  <div class="demo">
    <h2>Yuque Editor（编辑模式）</h2>
    <div class="tools">
      <button @click="getContent">获取内容</button>
      <button @click="appendContent">追加内容</button>
      <button @click="setContent">设置内容</button>
      <button @click="countWords">统计字数</button>
      <button @click="focusStart">聚焦开头</button>
    </div>
    <div style="height: 60vh; border: 1px solid gray; margin-bottom: 24px;">
      <YuqueRichText
        ref="editRef"
        :value="modelValue"
        :uploadImage="uploadImage"
        :uploadVideo="uploadVideo"
        @onChange="handleChange"
        @onLoad="handleLoad"
      />
    </div>

    <h2>Yuque Viewer（预览模式）</h2>
    <div style="height: 60vh; border: 1px solid gray; padding: 12px;">
      <YuqueRichText :isview="true" :value="output" />
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { YuqueRichText } from 'yuque-rich-text'
import type { IEditorRef } from 'yuque-rich-text'

const editRef = ref<IEditorRef>()
const modelValue = ref('<p>欢迎使用 Yuque Rich Text 编辑器</p>')
const output = ref('')

// 模拟上传图片
const uploadImage = async ({ data }: { data: File | string }) => {
  console.log('上传图片中...', data)
  // 模拟上传延迟
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return {
    url: 'https://via.placeholder.com/300x200.png?text=Uploaded+Image',
    size: 123456,
    filename: typeof data === 'string' ? 'image.png' : data.name,
  }
}

// 模拟上传视频
const uploadVideo = async ({ data }: { data: File | string }) => {
  console.log('上传视频中...', data)
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return {
    url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    size: 987654,
    filename: typeof data === 'string' ? 'video.mp4' : data.name,
  }
}

// 内容变更事件
const handleChange = (val: string) => {
  console.log('内容变更:', val)
  output.value = val
}

// 编辑器加载完成
const handleLoad = () => {
  console.log('编辑器加载完成')
  editRef.value?.appendContent('<p>编辑器已准备就绪</p>', true)
}

// 获取内容
const getContent = () => {
  const content = editRef.value?.getContent('text/html')
  alert('当前内容：\n' + content)
}

// 设置内容
const setContent = () => {
  editRef.value?.setContent('<p>这是新设置的内容</p>')
}

// 追加内容
const appendContent = () => {
  editRef.value?.appendContent('<p>追加一段内容</p>', true)
}

// 统计字数
const countWords = () => {
  const count = editRef.value?.wordCount()
  alert(`当前字数：${count}`)
}

// 聚焦到开头
const focusStart = () => {
  editRef.value?.focusToStart()
}
</script>

<style scoped>
.demo {
  padding: 24px;
  font-family: Arial, sans-serif;
}
.tools {
  margin-bottom: 12px;
}
.tools button {
  margin-right: 8px;
  padding: 6px 12px;
}
</style>
