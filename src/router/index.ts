import { useUserterStore } from '@/stores'
import { createRouter, createWebHistory } from 'vue-router'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
nprogress.configure({
  showSpinner: false,
})
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      component: () => import('@/views/Login/index.vue'),
      meta: { title: '登陆' },
    },
    {
      path: '/user/patient',
      component: () => import('@/views/User/PatientPage.vue'),
      meta: { title: '家庭档案' },
    },
    {
      path: '/',
      component: () => import('@/views/Layout/index.vue'),
      redirect: '/home',
      children: [
        {
          path: '/home',
          component: () => import('@/views/Home/index.vue'),
          meta: { title: '首页' },
        },
        {
          path: '/article',
          component: () => import('@/views/Article/index.vue'),
          meta: { title: '健康百科' },
        },
        {
          path: '/notify',
          component: () => import('@/views/Notify/index.vue'),
          meta: { title: '消息通知' },
        },
        {
          path: '/user',
          component: () => import('@/views/User/index.vue'),
          meta: { title: '个人信息' },
        },
      ],
    },
  ],
})

router.beforeEach((to) => {
  nprogress.start()
  const store = useUserterStore()
  const whiteList: string[] = ['/login']
  if (!store.user?.token && !whiteList.includes(to.path)) return '/login'
})

router.afterEach((to) => {
  document.title = `${to.meta.title || ''}-优医问诊`
  nprogress.done()
})
export default router
