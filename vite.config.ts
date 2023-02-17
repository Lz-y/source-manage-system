import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { visualizer } from 'rollup-plugin-visualizer'
import ViteSvgIcons from 'vite-plugin-svg-icons'
// import Components from 'unplugin-vue-components/vite'
// import AutoImport from 'unplugin-vue-components/vite'
// import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import compress from 'vite-plugin-compression'
import importToCDN from 'vite-plugin-cdn-import'

import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 9000,
    host: '0.0.0.0',
    open: true,
    proxy: {
      '^/api': {
        target: 'http://localhost:3060/api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  resolve: {
    alias: {
      '~': resolve(__dirname, './'),
      '@': resolve(__dirname, 'src'),
      '#': resolve(__dirname, 'types'),
    },
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.json', '.vue', '.mjs'],
  },
  plugins: [
    vue(),
    importToCDN({
      modules: [
        {
          name: 'vue',
          var: 'Vue',
          path: 'https://cdn.jsdelivr.net/npm/vue@3.2.25/dist/vue.global.prod.js',
        },
        // {
        //   name: 'vue-i18n',
        //   var: 'VueI18n',
        //   path: 'https://cdn.bootcdn.net/ajax/libs/vue-i18n/9.1.10/vue-i18n.global.prod.min.js',
        // },
        {
          name: 'vue-router',
          var: 'VueRouter',
          path: 'https://unpkg.com/vue-router@4.0.16/dist/vue-router.global.prod.js',
        },
        {
          name: 'element-plus',
          var: 'ElementPlus',
          path: `https://cdn.jsdelivr.net/npm/element-plus@2.2.12/dist/index.full.js`,
          css: 'https://cdn.jsdelivr.net/npm/element-plus@2.2.12/dist/index.css',
        },
        {
          name: 'vue-demi',
          var: 'VueDemi',
          path: 'https://cdn.bootcdn.net/ajax/libs/vue-demi/0.13.1/index.iife.js',
        },
        {
          name: 'pinia',
          var: 'Pinia',
          path: 'https://cdn.bootcdn.net/ajax/libs/pinia/2.0.14/pinia.iife.prod.min.js',
        },
        {
          name: 'echarts',
          var: 'echarts',
          path: 'https://cdn.jsdelivr.net/npm/echarts@5.3.2/dist/echarts.min.js',
        },
      ],
    }),
    ViteSvgIcons({
      iconDirs: [resolve(process.cwd(), 'src/icons')],
      symbolId: 'icon-[dir]-[name]',
    }),
    // AutoImport({
    //   resolvers: [ElementPlusResolver()]
    // }),
    // Components({
    //   resolvers: [ElementPlusResolver()],
    // }),
    compress({
      verbose: true, // 默认即可
      disable: false, //开启压缩(不禁用)，默认即可
      deleteOriginFile: false, //删除源文件
      threshold: 10240, //压缩前最小文件大小
      algorithm: 'gzip', //压缩算法
      ext: '.gz', //文件类型
    }),
    visualizer(),
  ],
  base: '/',
  build: {
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        chunkFileNames: 'static/js/[name]-[hash].js',
        entryFileNames: 'static/js/[name]-[hash].js',
        assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
        // manualChunks: {
        //   echarts: ['echarts'],
        // },
        // format: 'es',
        globals: {
          vue: 'Vue',
          'vue-router': 'VueRouter',
          pinia: 'Pinia',
          'element-plus': 'ElementPlus',
          'echarts': 'echarts'
        }
      },
      external: ['vue', 'vue-router', 'pinia', 'element-plus', 'echarts'],
      // plugins: [
      //   globals
      // ]
    },
    chunkSizeWarningLimit: 1024,
  },
  esbuild: {
    // pure: ['console.log'],
    minify: true,
  },
})
