import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts';

const libDir = path.resolve(__dirname, 'lib');
const srcDir = path.resolve(__dirname, 'src');

// https://vite.dev/config/
export default ({mode})=>{
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  const IS_DEMO = process.env.VITE_BUILD_TARGET === 'demo';

  return defineConfig({
    plugins: [vue(),
      IS_DEMO
        ? null
        : dts({
            include: ['src'],
            insertTypesEntry: true,
          }),
    ],
    resolve: {
      alias: [
        {
          find: '@',
          replacement: path.resolve(__dirname, 'src'),
        },
        {
          find: 'demo',
          replacement: path.resolve(__dirname, 'demo'),
        },
        {
          find: 'yuque-rich-text',
          replacement: path.resolve(__dirname, 'src/index.ts'),
        },
      ],
    },
    build: IS_DEMO
      ? undefined
      : {
          outDir: libDir,
          minify: 'esbuild',
          lib: {
            entry: path.resolve(srcDir, 'index.ts'),
            name: 'YuqueRichText',
            fileName: 'yuque-rich-text',
          },
          // https://rollupjs.org/guide/en/#big-list-of-options
          rollupOptions: {
            // 确保外部化处理那些你不想打包进库的依赖
            external: [
              'vue',
            ],
            output: {
              exports: 'named',
              // https://github.com/henriquehbr/svelte-typewriter/issues/21#issuecomment-968835822
              inlineDynamicImports: true,
              // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
              globals: {
                vue: 'vue',
                
              },
            },
            plugins: [
              
            ],
          },
        },
    // publicDir: IS_DEMO ? 'public' : false,
  })
}
