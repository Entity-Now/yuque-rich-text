import { defineComponent as r, ref as i, onMounted as v, onUnmounted as f, watch as m, h as p } from "vue";
import { m as g } from "./create-lake-editor-Ckf9PBWV.js";
const c = r({
  name: "YuqueRichText",
  props: {
    value: {
      type: String,
      default: ""
    },
    isview: {
      type: Boolean,
      default: !1
    },
    placeholder: {
      type: String,
      default: "输入内容..."
    },
    defaultFontsize: {
      type: Number,
      default: 14
    },
    /** Nested upload config object. */
    upload: {
      type: Object,
      default: void 0
    },
    /** Image upload endpoint URL. */
    imageUploadURL: {
      type: String,
      default: void 0
    },
    /** Remote image crawl endpoint URL. */
    imageCrawlURL: {
      type: String,
      default: void 0
    },
    /** Video upload endpoint URL. */
    videoUploadURL: {
      type: String,
      default: void 0
    },
    /** Custom image upload handler. */
    uploadImage: {
      type: Function,
      default: void 0
    },
    /** Custom video upload handler. */
    uploadVideo: {
      type: Function,
      default: void 0
    }
  },
  emits: ["onChange", "onLoad", "onSave", "update:value"],
  setup(a, { emit: n, expose: u }) {
    const d = i(), o = i(null);
    return u({
      appendContent: (e, t) => {
        var l;
        return (l = o.value) == null ? void 0 : l.appendContent(e, t);
      },
      setContent: (e, t) => {
        var l;
        return (l = o.value) == null ? void 0 : l.setContent(e, t);
      },
      getContent: (e) => {
        var t;
        return ((t = o.value) == null ? void 0 : t.getContent(e)) ?? "";
      },
      isEmpty: () => {
        var e;
        return ((e = o.value) == null ? void 0 : e.isEmpty()) ?? !0;
      },
      getSummaryContent: () => {
        var e;
        return ((e = o.value) == null ? void 0 : e.getSummaryContent()) ?? "";
      },
      wordCount: () => {
        var e;
        return ((e = o.value) == null ? void 0 : e.wordCount()) ?? 0;
      },
      focusToStart: (e) => {
        var t;
        return (t = o.value) == null ? void 0 : t.focusToStart(e);
      },
      insertBreakLine: () => {
        var e;
        return (e = o.value) == null ? void 0 : e.insertBreakLine();
      }
    }), v(() => {
      const e = d.value;
      e && g(e, {
        value: a.value,
        isview: a.isview,
        placeholder: a.placeholder,
        defaultFontsize: a.defaultFontsize,
        upload: a.upload,
        imageUploadURL: a.imageUploadURL,
        imageCrawlURL: a.imageCrawlURL,
        videoUploadURL: a.videoUploadURL,
        uploadImage: a.uploadImage,
        uploadVideo: a.uploadVideo,
        onChange: (t) => {
          n("onChange", t), n("update:value", t);
        },
        onLoad: () => n("onLoad"),
        onSave: () => n("onSave")
      }).then((t) => {
        o.value = t;
      }).catch((t) => {
        console.error("[yuque-rich-text] failed to mount editor", t);
      });
    }), f(() => {
      var e;
      (e = o.value) == null || e.destroy(), o.value = null;
    }), m(
      () => a.value,
      (e) => {
        var t;
        (t = o.value) == null || t.setValue(e ?? "");
      }
    ), () => p("iframe", {
      ref: d,
      class: "lake-editor",
      height: "100%",
      width: "100%",
      // srcdoc is assigned in mountLakeEditor after the load listener is attached
      allow: "*",
      style: "background: transparent; border: none;"
    });
  }
}), U = r({
  name: "YuqueRichTextView",
  props: {
    value: {
      type: String,
      default: ""
    },
    placeholder: {
      type: String,
      default: ""
    },
    defaultFontsize: {
      type: Number,
      default: 14
    },
    upload: {
      type: Object,
      default: void 0
    },
    imageUploadURL: {
      type: String,
      default: void 0
    },
    imageCrawlURL: {
      type: String,
      default: void 0
    },
    videoUploadURL: {
      type: String,
      default: void 0
    },
    uploadImage: {
      type: Function,
      default: void 0
    },
    uploadVideo: {
      type: Function,
      default: void 0
    }
  },
  emits: ["onLoad"],
  setup(a, { emit: n, attrs: u }) {
    return () => p(c, {
      ...u,
      ...a,
      isview: !0,
      onOnLoad: () => n("onLoad")
    });
  }
});
export {
  c as Y,
  U as l
};
