function T(n) {
  const o = n.upload ?? {}, u = n.imageUploadURL ?? o.imageUploadURL ?? "/api/upload/image", s = n.imageCrawlURL ?? o.imageCrawlURL ?? u, t = n.videoUploadURL ?? o.videoUploadURL ?? "/api/upload/video";
  return {
    imageUploadURL: u,
    imageCrawlURL: s,
    videoUploadURL: t,
    uploadImage: n.uploadImage ?? o.uploadImage,
    uploadVideo: n.uploadVideo ?? o.uploadVideo
  };
}
const S = 1e4;
function A(n) {
  return !!n.Doc;
}
function M(n) {
  const o = Date.now();
  return new Promise((u, s) => {
    if (A(n)) {
      u(n.Doc);
      return;
    }
    const t = () => {
      A(n) ? u(n.Doc) : Date.now() - o > S ? s(new Error("load lake editor timeout")) : setTimeout(t, 100);
    };
    setTimeout(t, 100);
  });
}
function q({ EditorPlugin: n, KernelPlugin: o, PositionUtil: u, OpenEditorFactory: s, toolbarItems: t, Command: e, SelectionUtil: x }, U) {
  const y = class y extends n {
    init() {
      var a;
      this.editor.option.toolbar._option.agentConfig = {
        default: {
          items: [
            t.bold,
            t.italic,
            t.strikethrough,
            t.underline,
            "|",
            t.color,
            t.bgColor,
            "|",
            t.quote,
            t.hr,
            t.codeblock
          ]
        },
        table: {
          items: [
            t.bold,
            t.italic,
            t.strikethrough,
            t.underline,
            "|",
            t.color,
            t.bgColor,
            t.tableCellBgColor,
            t.tableBorderVisible,
            "|",
            t.alignment,
            t.tableVerticalAlign,
            t.tableMergeCell,
            "|",
            t.quote,
            t.hr,
            t.code
          ]
        }
      }, (a = this.editor.getService({ value: "IToolbarEditorService" })) == null || a.setLayer(U.getElementById("toolbar"));
    }
  };
  y.PluginName = "CustomEditorPlugin";
  let w = y;
  class b extends e {
    execute(a, g) {
      var v;
      const r = a.newJob(), { kernel: m } = this;
      let p = m.readData("text/html", g, {
        from: "insert",
        self: !1,
        forceText: !1
      });
      return p ? (p = ((v = m.getExtendMethod("normalizeINodeTree")) == null ? void 0 : v(r, p)) || p, r.setSelection(x.insertINode(r, r.getSelection(), p)), a.commitJob(r), !0) : !1;
    }
  }
  const d = class d extends o {
    init(a) {
      a.registerCommand("insertHTML", new b());
      const g = a.getService({ value: "IHTMLKernelService" });
      g && (g.registerHTMLNodeReader(
        ["blockquote"],
        {
          readNode(r, m) {
            r.setNode({
              id: m.attrs.id || "",
              type: "element",
              name: "quote",
              attrs: {}
            });
          },
          leaveNode() {
          }
        }
      ), g.registerHTMLNodeReader(
        ["code"],
        {
          readNode(r, m) {
            r.setNode({
              id: m.attrs.id || "",
              type: "element",
              name: "code",
              attrs: {}
            });
          },
          leaveNode() {
          }
        }
      ));
    }
  };
  d.PluginName = "CustomEditorPlugin";
  let f = d;
  s.registerKernelPlugin([f]);
}
const B = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title></title>
  <link rel="stylesheet" type="text/css" href="https://gw.alipayobjects.com/render/p/yuyan_npm/@alipay_lakex-doc/1.71.0/umd/doc.css"/>
  <link rel="stylesheet" type="text/css" href="https://gw.alipayobjects.com/os/lib/antd/4.24.13/dist/antd.css"/>
  <style>
    body {
      display: flex;
      flex-direction: column;
      overflow: hidden;
      -webkit-font-smoothing: antialiased;
    }
    .toolbar-container {
      display: none;
    }
    #toolbar {
      flex: 1;
    }
    #root {
      flex: 1;
      overflow: hidden;
    }
    #child {
      display: flex;
      align-items: center;
      padding: 0 16px;
    }
    .ne-layout-mode-fixed .ne-engine, .ne-layout-mode-adapt .ne-engine {
      padding-top: 16px;
    }
    .ne-layout-mode-fixed .ne-editor-body, .ne-layout-mode-adapt .ne-editor-body {
      height: 100%;
    }
    .ne-ui-overlay-button {
      width: 28px !important;
      height: 28px !important;
      padding: 0 !important;;
      border: none !important;;
    }
    ::selection {
      color: #fff !important;
      background: #1677ff !important;
    }
    .continue-button:hover, .continue-button:focus {
      color: #00B96B;
      border-color: #00B96B;
    }
    .ne-layout-mode-fixed .ne-editor-wrap {
      padding: 16px 16px 0;
      height: 100%;
    }
    .ne-layout-mode-fixed .ne-engine, .ne-layout-mode-adapt .ne-engine {
      padding: 16px 24px 0;
      min-height: calc(100vh - 10px)
    }
    .ne-layout-mode-fixed .ne-editor-wrap-content {
      min-width: 317px;
    }
    .ne-layout-mode-fixed .ne-editor-outer-wrap-box {
      min-width: 317px;
    }
    .ne-layout-mode-fixed .ne-editor-outer-wrap-box, .ne-layout-mode-adapt .ne-editor-outer-wrap-box,
    .ne-layout-mode-fixed .ne-editor-wrap-content, .ne-layout-mode-adapt .ne-editor-wrap-content {
      min-width: 317px;
    }
    .ne-editor-wrap {
      overscroll-behavior: contain;
    }
  </style>
</head>
<body>
  <div class="toolbar-container">
    <div id="toolbar"></div>
    <div id="child"></div>
  </div>
  <div id="root"></div>
<script crossorigin src="https://unpkg.com/react@18.2.0/umd/react.production.min.js"><\/script>
<script crossorigin src="https://unpkg.com/react-dom@18.2.0/umd/react-dom.production.min.js"><\/script>
<script src="https://gw.alipayobjects.com/render/p/yuyan_v/180020010000005484/7.1.4/CodeMirror.js"><\/script>
<script src="https://ur.alipay.com/tracert_a385.js"><\/script>
<script src="https://mdn.alipayobjects.com/design_kitchencore/afts/file/ANSZQ7GHQPMAAAAAAAAAAAAADhulAQBr"><\/script>
<script src="https://gw.alipayobjects.com/render/p/yuyan_npm/@alipay_lakex-doc/1.71.0/umd/doc.umd.js"><\/script>
</body>
</html>
`, V = "yqextensionblockquoteid";
function _(n, o) {
  return new Promise((u, s) => {
    let t = !1, e = null, x = !1;
    const U = typeof window < "u", w = (d) => {
      var l;
      d.key === "Enter" && (U ? d.ctrlKey : d.metaKey) && ((l = o.onSave) == null || l.call(o));
    }, b = () => {
      n.removeEventListener("load", y);
    };
    let f = !1;
    const y = () => {
      if (t || f || e) return;
      f = !0;
      const d = n.contentDocument, l = n.contentWindow;
      if (!d || !l) {
        f = !1, s(new Error("iframe document is not available"));
        return;
      }
      const { createOpenEditor: a, createOpenViewer: g } = l.Doc;
      q(l.Doc, d), M(l).then(() => {
        var E;
        if (t) return;
        const r = T(o), m = o.isview ? g : a, p = {
          uploadFileURL: r.imageUploadURL,
          crawlURL: r.imageCrawlURL
        };
        r.uploadImage && (p.createUploadPromise = r.uploadImage);
        const v = {
          uploadFileURL: r.videoUploadURL
        };
        r.uploadVideo && (v.createUploadPromise = r.uploadVideo);
        const h = m(d.getElementById("root"), {
          scrollNode: () => d.querySelector(".ne-editor-wrap"),
          image: p,
          video: v,
          placeholder: o.placeholder ?? "输入内容...",
          defaultFontsize: o.defaultFontsize ?? 14
        });
        h.on("visitLink", (i) => {
          window.open(i, "__blank");
        }), o.isview || h.on("contentchange", () => {
          var i;
          x = !0, (i = o.onChange) == null || i.call(
            o,
            h.getDocument("text/lake", {
              includeMeta: !0
            })
          ), queueMicrotask(() => {
            x = !1;
          });
        }), l.editor = h, e = h, o.value && (h.setDocument("lake", o.value), o.isview || h.execCommand("paragraphSpacing", "relax")), d.addEventListener("keydown", w, !0), (E = o.onLoad) == null || E.call(o), u({
          getRawEditor: () => e,
          setValue: (i) => {
            if (!e || x) return;
            const k = e.getDocument("text/lake", {
              includeMeta: !0
            });
            i !== k && (e.setDocument("lake", i ?? ""), o.isview || e.execCommand("paragraphSpacing", "relax"));
          },
          appendContent: (i, k = !1) => {
            var c, C;
            e && (k && e.execCommand("breakLine"), e.kernel.execCommand("insertHTML", i), n.focus(), e.execCommand("focus"), (C = (c = e.renderer) == null ? void 0 : c.scrollToCurrentSelection) == null || C.call(c));
          },
          setContent: (i, k = "text/html") => {
            var C, N, L, R;
            if (!e) return;
            n.focus(), e.setDocument(k, i), e.execCommand("focus", "end");
            const c = (R = (L = (N = (C = e.kernel) == null ? void 0 : C.model) == null ? void 0 : N.document) == null ? void 0 : L.getNodeById) == null ? void 0 : R.call(
              L,
              V
            );
            if (c) {
              const D = e.kernel.model.document.rootNode;
              if (D.firstNode === c)
                return;
              e.kernel.execCommand("selection", {
                ranges: [
                  {
                    start: {
                      node: D.children[c.offset - 1],
                      offset: D.children[c.offset - 1].childCount
                    }
                  }
                ]
              }), e.execCommand("focus");
            }
          },
          isEmpty: () => e ? e.queryCommandValue("isEmpty") : !0,
          getContent: (i) => e ? i === "lake" ? e.getDocument("text/lake", {
            includeMeta: !0
          }) : i === "text/html" ? e.getDocument("text/html") : e.getDocument("description") : "",
          getSummaryContent: () => e ? e.queryCommandValue(
            "getSummary",
            "lake"
          ) : "",
          wordCount: () => e ? e.queryCommandValue("wordCount") : 0,
          focusToStart: (i = 0) => {
            e && (n.focus(), i ? (e.kernel.execCommand("selection", {
              ranges: [
                {
                  start: {
                    node: e.kernel.model.document.rootNode.children[i],
                    offset: 0
                  }
                }
              ]
            }), e.execCommand("focus")) : e.execCommand("focus", "start"));
          },
          insertBreakLine: () => {
            e && e.execCommand("breakLine");
          },
          destroy: () => {
            t = !0, b(), d.removeEventListener(
              "keydown",
              w,
              !0
            ), e = null;
          }
        });
      }).catch(s);
    };
    n.addEventListener("load", y), n.srcdoc = B;
  });
}
export {
  _ as m
};
