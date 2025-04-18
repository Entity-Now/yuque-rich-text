<template>
  <div class="demo">
    <div class="tools">
      <button @click="getContent">getContent</button>
    </div>
    <h2>Yuque Editor</h2>
    <div style="height: 60vh; border: 1px gray solid">
      <YuqueRichText key="1" ref="editRef" :value="modelValue" @onChange="(e) => (output = e)" />
    </div>
    <h2>Yuque Viewer</h2>
    <div style="height: 60vh; border: 1px gray solid;padding: 12px;">
      <YuqueRichText key="2" :isview="true" :value="output" />
    </div>
    <h2>版权说明</h2>
    <div>
      此项目来自<a href="https://github.com/yuque/yuque-chrome-extension">yuque-chrome-extension</a>，请遵守此项目的用户协议
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, PropType } from "vue";
import { YuqueRichText } from "yuque-rich-text";

const editRef = ref<InstanceType<typeof YuqueRichText>>();
const modelValue = ref("123");
const output = ref("");

const getContent = () => {
  alert(editRef.value?.getContent("lake"));
};
</script>

<style>
.demo{
  position: relative;
  width: 100%;
  height: 100%;
  padding: 2px;
  display: flex;
  flex-direction: column;
}
.demo > .tools{
  width: 100%;
  height: 60px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 10px;
}
</style>
