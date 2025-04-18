
/**
 * iframe的内容
 */
export const templateHtml = `
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
<script crossorigin src="https://unpkg.com/react@18.2.0/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18.2.0/umd/react-dom.production.min.js"></script>
<script src="https://gw.alipayobjects.com/render/p/yuyan_v/180020010000005484/7.1.4/CodeMirror.js"></script>
<script src="https://ur.alipay.com/tracert_a385.js"></script>
<script src="https://mdn.alipayobjects.com/design_kitchencore/afts/file/ANSZQ7GHQPMAAAAAAAAAAAAADhulAQBr"></script>
<script src="https://gw.alipayobjects.com/render/p/yuyan_npm/@alipay_lakex-doc/1.71.0/umd/doc.umd.js"></script>
</body>
</html>
`;
