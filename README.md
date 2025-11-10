# Yuque Rich Text（语雀富文本编辑器）

由于本人觉得语雀编辑器非常好用，很符合我的使用习惯，然后发现语雀的[Chrome浏览器插件](https://github.com/yuque/yuque-chrome-extension)实现了编辑器的功能，所以将其富文本的功能拆分位一个单独的Vue3组件。

## 安装
```sh
npm i yuque-rich-text
```

## 截图
![组件实例](https://github.com/Entity-Now/yuque-rich-text/blob/master/public/Images/yuque-rich-text.gif)

### 引入相关样式

`head`标签中加入

``` html
  <head>
    <link rel="stylesheet" type="text/css" href="https://gw.alipayobjects.com/render/p/yuyan_npm/@alipay_lakex-doc/1.71.0/umd/doc.css"/>
    <link rel="stylesheet" type="text/css" href="https://gw.alipayobjects.com/os/lib/antd/4.24.13/dist/antd.css"/>
  </head>
```

`body`标签内的最后一行加入

```html
  <body>
    <script crossorigin src="https://unpkg.com/react@18.2.0/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18.2.0/umd/react-dom.production.min.js"></script>
    <script src="https://gw.alipayobjects.com/render/p/yuyan_v/180020010000005484/7.1.4/CodeMirror.js"></script>
    <script src="https://ur.alipay.com/tracert_a385.js"></script>
    <script src="https://mdn.alipayobjects.com/design_kitchencore/afts/file/ANSZQ7GHQPMAAAAAAAAAAAAADhulAQBr"></script>
    <script src="https://gw.alipayobjects.com/render/p/yuyan_npm/@alipay_lakex-doc/1.71.0/umd/doc.umd.js"></script>
  </body>
```

### 编辑使用案例
> 注意不可在onChange事件中修改value的值，否则会进入无限递归。

```html

<template>
  <YuqueRichText ref="editorRef" :value="content" @onChange="editChange" @onLoad="load"/>
  <button @click="appendText">追加内容</button>
  <button @click="getContent">获取内容</button>
  <button @click="setText">更新内容</button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { YuqueRichText } from 'yuque-rich-text'
import type { IEditorRef } from "yuque-rich-text";

const editorRef = ref<IEditorRef>()
const content = ref('初始内容')

const appendText = () => {
  if (editorRef.value) {
    editorRef.value.appendContent('<p>这是追加的内容</p>', true)
  }
}
const setText = () => {
  if (editorRef.value) {
    editorRef.value.setContent('<p>更新的内容</p>')
  }
}

const getContent = () => {
  if (editorRef.value) {
    const html = editorRef.value.getContent('text/html')
    alert('当前内容:' + html)
  }
}

const load = ()=>{
  console.log("编辑器加载成功...");
  // 此时可进行增删改查操作
  editorRef.value?.appendContent('<p>这是追加的内容</p><br>', true)
}

const editChange = (e : string)=>{
  console.log("编辑器内容发生变化：", e);
}
</script>
```

### 预览模式

> 使用也非常简单， 将组建的`isview`属性改为`true`即可。

```html
<template>
  <YuqueRichText :isview="true" :value="content" />
</template>
```

### Props

```js
    export interface EditorProps {
        value: string; // 传递给组件的内容
        children?: any; // 暂无实现
        isview?: boolean; // 为true该组件是只读的，为空或false则是编辑模式
        uploadImage?: (params: { data: string | File }) => Promise<{
            url: string;
            size: number;
            filename: string;
        }>;
        uploadVideo?: (params: { data: string | File }) => Promise<{
            url: string;
            size: number;
            filename: string;
        }>;
    }
```

### Emit

```js
    export interface EditorEmits{
        onChange?: (value: string) => void;
        onLoad?: () => void;
        onSave?: () => void;
    }
```

## Expose

```js
    export interface IEditorRef {
        /**
         * 追加html到文档
         * @param html html内容
         * @param breakLine 是否前置一个换行符
         */
        appendContent: (html: string, breakLine?: boolean) => void;
        /**
         * 设置文档内容，将清空旧的内容
         * @param html html内容
         */
        setContent: (content: string, type?: "text/lake" | "text/html") => void;
        /**
         * 获取文档内容
         * @param type 内容的格式
         * @return 文档内容
         */
        getContent: (type: "lake" | "text/html") => string;
        /**
         * 判断当前文档是否是空文档
         * @return true表示当前是空文档
         */
        isEmpty: () => boolean;

        /**
         * 获取额外信息
         * @return
         */
        getSummaryContent: () => string;

        /**
         * 统计字数
         * @return
         */
        wordCount: () => number;

        /**
         * 聚焦到文档开头
         * @param {number} offset 偏移多少个段落，可以将选区落到开头的第offset个段落上, 默认是0
         * @return
         */
        focusToStart: (offset?: number) => void;

        /**
         * 插入换行符
         * @return
         */
        insertBreakLine: () => void;
    }
```


## ⚠️ Disclaimer  
This is an **unofficial third-party extension** for `[www.yuque.com]`. It is not affiliated with, maintained by, or endorsed by `[www.yuque.com]`.  

- **Use at your own risk**. The developers are not responsible for any violations of `[www.yuque.com]`'s terms or damages caused by this project.  
- **Do not use** if `[www.yuque.com]` prohibits third-party modifications.  
- This project does not redistribute any copyrighted materials from `[www.yuque.com]`.  

[Read `[www.yuque.com]`'s Terms of Service](www.yuque.com) before installation.  

## 友情链接 [莫欺客鞋帽优选](https://www.moqistar.com)
