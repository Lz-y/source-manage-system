import { createRouter, createWebHistory } from 'vue-router'
import NProgress from 'nprogress'
import routes from './routes'

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return new Promise((resolve) => {
      if (savedPosition) {
        return savedPosition
      } else {
        const top: number = document.documentElement.scrollTop || document.body.scrollTop
        resolve({ top })
      }
    })
  }
})

router.beforeEach((to, from, next) => {
  NProgress.start()
  document.title = to.meta.title!
  next()
})

router.afterEach(() => {
  NProgress.done()
})
export default router