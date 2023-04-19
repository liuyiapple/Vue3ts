import router from '@/router'
import { useUserterStore } from '@/stores'
import axios, { AxiosError, Method } from 'axios'
import { showToast } from 'vant'

const serve = axios.create({
  baseURL: 'https://consult-api.itheima.net/',
  timeout: 5000,
})
serve.interceptors.request.use((config) => {
  const store = useUserterStore()
  if (store.user?.token && config.headers) {
    config.headers.Authorization = `Bearer ${store.user.token}`
  }
  return config
})

serve.interceptors.response.use(
  ({ data }) => {
    if (data.code !== 1000) {
      showToast(data.message || '业务失败')
      return Promise.reject(data)
    }
    return data
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // 清除本地信息，携带地址 包含参数
      const store = useUserterStore()
      store.delUser()
      router.push({
        path: '/login',
        query: {
          returnUrl: router.currentRoute.value.fullPath,
        },
      })
    }
    return Promise.reject(error)
  }
)
export default serve

type Data<T> = {
  code: number
  message: string
  data: T
}

export const request = <T>(url: string, method: Method, data?: object) => {
  return serve.request<any, Data<T>>({
    url,
    method,
    [method.toLocaleUpperCase() === 'GET' ? 'params' : 'data']: data,
  })
}
