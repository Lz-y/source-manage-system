import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import ViteSvgIcons from 'vite-plugin-svg-icons'
// import Components from 'unplugin-vue-components/vite'
// import AutoImport from 'unplugin-vue-components/vite'
// import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 9000,
    host: '0.0.0.0',
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3060/api',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
        
      }
    }
  },
  resolve: {
    alias: {
      '~': resolve(__dirname, './'),
      '@': resolve(__dirname, 'src')
    },
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.json', '.vue', '.mjs']
  },
  plugins: [
    vue(),
    ViteSvgIcons({
      iconDirs: [resolve(process.cwd(), 'src/icons')],
      symbolId: 'icon-[dir]-[name]'
    }),
    // AutoImport({
    //   resolvers: [ElementPlusResolver()]
    // }),
    // Components({
    //   resolvers: [ElementPlusResolver()],
    // }),
  ]
})
