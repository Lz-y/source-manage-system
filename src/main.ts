import { createApp } from 'vue'

import { createPinia } from 'pinia'
import 'normalize.css'
import ElementPlus from 'element-plus'
// import 'element-plus/dist/index.css'

import 'virtual:svg-icons-register'

import router from './router/index'

import '@/styles/index.scss'

import App from './App.vue'

import SvgIcon from '@/components/SvgIcon.vue'

const app = createApp(App)

app.component('svg-icon', SvgIcon)

app.use(createPinia()).use(router).use(ElementPlus).mount('#app')
