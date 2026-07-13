import { jsx as y } from "react/jsx-runtime";
import { forwardRef as C, useRef as s, useImperativeHandle as T, useEffect as L } from "react";
import { m as j } from "./create-lake-editor-Ckf9PBWV.js";
const R = C(
  function(u, c) {
    const {
      value: i = "",
      isview: w,
      isView: k,
      placeholder: v = "输入内容...",
      defaultFontsize: S = 14,
      upload: V,
      imageUploadURL: U,
      imageCrawlURL: x,
      videoUploadURL: E,
      uploadImage: b,
      uploadVideo: N,
      onChange: l,
      onLoad: d,
      onSave: f,
      className: q = "lake-editor",
      style: B
    } = u, m = w ?? k ?? !1, p = s(null), n = s(null), a = s({ onChange: l, onLoad: d, onSave: f });
    a.current = { onChange: l, onLoad: d, onSave: f }, T(
      c,
      () => ({
        appendContent: (e, r) => {
          var t;
          return (t = n.current) == null ? void 0 : t.appendContent(e, r);
        },
        setContent: (e, r) => {
          var t;
          return (t = n.current) == null ? void 0 : t.setContent(e, r);
        },
        getContent: (e) => {
          var r;
          return ((r = n.current) == null ? void 0 : r.getContent(e)) ?? "";
        },
        isEmpty: () => {
          var e;
          return ((e = n.current) == null ? void 0 : e.isEmpty()) ?? !0;
        },
        getSummaryContent: () => {
          var e;
          return ((e = n.current) == null ? void 0 : e.getSummaryContent()) ?? "";
        },
        wordCount: () => {
          var e;
          return ((e = n.current) == null ? void 0 : e.wordCount()) ?? 0;
        },
        focusToStart: (e) => {
          var r;
          return (r = n.current) == null ? void 0 : r.focusToStart(e);
        },
        insertBreakLine: () => {
          var e;
          return (e = n.current) == null ? void 0 : e.insertBreakLine();
        }
      }),
      []
    ), L(() => {
      const e = p.current;
      if (!e) return;
      let r = !1;
      return j(e, {
        value: i,
        isview: m,
        placeholder: v,
        defaultFontsize: S,
        upload: V,
        imageUploadURL: U,
        imageCrawlURL: x,
        videoUploadURL: E,
        uploadImage: b,
        uploadVideo: N,
        onChange: (t) => {
          var o, h;
          return (h = (o = a.current).onChange) == null ? void 0 : h.call(o, t);
        },
        onLoad: () => {
          var t, o;
          return (o = (t = a.current).onLoad) == null ? void 0 : o.call(t);
        },
        onSave: () => {
          var t, o;
          return (o = (t = a.current).onSave) == null ? void 0 : o.call(t);
        }
      }).then((t) => {
        if (r) {
          t.destroy();
          return;
        }
        n.current = t;
      }).catch((t) => {
        console.error(
          "[yuque-rich-text] failed to mount editor",
          t
        );
      }), () => {
        var t;
        r = !0, (t = n.current) == null || t.destroy(), n.current = null;
      };
    }, [m]), L(() => {
      var e;
      (e = n.current) == null || e.setValue(i ?? "");
    }, [i]);
    const I = {
      background: "transparent",
      border: "none",
      width: "100%",
      height: "100%",
      ...B
    };
    return /* @__PURE__ */ y(
      "iframe",
      {
        ref: p,
        className: q,
        allow: "*",
        style: I,
        title: "yuque-rich-text"
      }
    );
  }
);
R.displayName = "LakeRich";
const z = C(function(u, c) {
  return /* @__PURE__ */ y(R, { ...u, ref: c, isview: !0 });
});
z.displayName = "LakeRichView";
export {
  R as LakeRich,
  z as LakeRichView,
  R as default
};
