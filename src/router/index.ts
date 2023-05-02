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
      path: '/consult/fast',
      component: () => import('@/views/Consult/ConsultFast.vue'),
      meta: { title: '极速问诊' },
    },
    {
      path: '/consult/dep',
      component: () => import('@/views/Consult/ConsultDep.vue'),
      meta: { title: '选择科室' },
    },
    {
      path: '/consult/illness',
      component: () => import('@/views/Consult/ConsultIllness.vue'),
      meta: { title: '图文问诊' },
    },
    {
      path: '/consult/pay',
      component: () => import('@/views/Consult/ConsultPay.vue'),
      meta: { title: '问诊支付' },
    },
    {
      path: '/room',
      component: () => import('@/views/Room/index.vue'),
      meta: { title: '问诊室' },
      beforeEnter(to) {
        if (to.query.payResult === 'false') return '/user/consult'
      },
    },
    {
      path: '/user/consult/:id',
      component: () => import('@/views/User/ConsultDetail.vue'),
      meta: { title: '问诊详情' },
    },
    {
      path: `/user/consult`,
      component: () => import('@/views/User/ConsultPage.vue'),
      meta: { title: '问诊记录' },
    },
    {
      path: `/order/pay/result`,
      component: () => import('@/views/Order/OrderPayResult.vue'),
      meta: { title: '药品支付结果' },
    },
    {
      path: `/order/pay`,
      component: () => import('@/views/Order/OrderPay.vue'),
      meta: { title: '药品支付' },
    },
    {
      path: `/order/:id`,
      component: () => import('@/views/Order/OrderDetail.vue'),
      meta: { title: '订单详情' },
    },
    {
      path: `/order/logistics/:id`,
      component: () => import('@/views/Order/OrderLogistics.vue'),
      meta: { title: '物流详情' },
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
  const whiteList: string[] = ['/login', '/login/callback']
  if (!store.user?.token && !whiteList.includes(to.path)) return '/login'
})

router.afterEach((to) => {
  document.title = `${to.meta.title || ''}-优医问诊`
  nprogress.done()
})
export default router
