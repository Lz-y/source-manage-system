const routes = [
  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    redirect: '/home',
    children: [
      {
        path: 'home',
        name: 'home',
        component: () => import('@/views/home/index.vue'),
        meta: { title: 'home', icon: 'home', auth: true }
      }
    ]
  },
  {
    path: '/user',
    component: () => import('@/layout/index.vue'),
    children: [
      {
        path: '',
        name: 'user',
        component: () => import('@/views/user/index.vue'),
        meta: { title: 'user', icon: 'user', auth: true }
      }
    ]
  },
  {
    path: '/article',
    component: () => import('@/layout/index.vue'),
    children: [
      {
        path: '',
        name: 'article',
        component: () => import('@/views/article/index.vue'),
        meta: { title: 'article', icon: 'article', auth: true }
      }
    ]
  },
  {
    path: '/resource',
    component: () => import('@/layout/index.vue'),
    children: [
      {
        path: '',
        name: 'resource',
        component: () => import('@/views/resource/index.vue'),
        meta: { title: 'resource', icon: 'resource', auth: true }
      }
    ]
  },
  {
    path: '/message',
    component: () => import('@/layout/index.vue'),
    children: [
      {
        path: '',
        name: 'message',
        component: () => import('@/views/message/index.vue'),
        meta: { title: 'message', icon: 'message', auth: true }
      }
    ]
  },
  {
    path: '/page',
    component: () => import('@/layout/index.vue'),
    children: [
      {
        path: '',
        name: 'page',
        component: () => import('@/views/page/index.vue'),
        meta: { title: 'page', icon: 'page', auth: true }
      }
    ]
  },
  {
    path: '/logs',
    component: () => import('@/layout/index.vue'),
    children: [
      {
        path: '',
        name: 'logs',
        component: () => import('@/views/log/index.vue'),
        meta: { title: 'log', icon: 'log', auth: true }
      }
    ]
  },
  {
    path: '/setting',
    component: () => import('@/layout/index.vue'),
    children: [
      {
        path: '',
        name: 'setting',
        component: () => import('@/views/setting/index.vue'),
        meta: { title: 'setting', icon: 'setting', auth: true }
      },
    ]
  },
  {
    path: '/login',
    name: 'login',
    hidden: true,
    component: () => import('@/views/login/index.vue'),
    meta: { title: 'login', icon: 'login' }
  },
  {
    path: '/404',
    name: '404',
    hidden: true,
    component: () => import('@/views/NotFound/index.vue'),
    meta: { title: '404', icon: '404' }
  },
  {
    path: '/:path(.*)*',
    redirect: '/404',
    hidden: true
  }
]
export default routes