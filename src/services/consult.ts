import type {
  KnowledgePageType,
  KnowledgeParamsType,
  DoctorParamsType,
  DoctorPageType,
  FollowType,
  TopDep,
  Image,
  ConsultOrderPreParams,
  ConsultOrderPerData,
  PartialConsult,
  ConsultOrderItem,
  COnsultOrderPage,
} from '@/types/consult'
import { request } from '@/utils/request'

export const getKnowledgePage = (params: KnowledgeParamsType) => {
  return request<KnowledgePageType>('patient/home/knowledge', 'GET', params)
}

export const getDoctorPage = (params: DoctorParamsType) => {
  return request<DoctorPageType>('home/page/doc', 'GET', params)
}

export const followOrUnfollow = (id: string, type: FollowType = 'doc') => {
  return request('like', 'POST', { id, type })
}

// 获取所有科室
export const getAllDep = () => {
  return request<TopDep[]>('dep/all', 'GET')
}

// 上传
export const uploadImage = (file: File) => {
  const fd = new FormData()
  fd.append('file', file)
  return request<Image>('upload', 'POST', fd)
}

export const getConsultOrderPre = (params: ConsultOrderPreParams) => {
  return request<ConsultOrderPerData>(
    '/patient/consult/order/pre',
    'GET',
    params
  )
}

// 生成订单
export const createConsultOrder = (data: PartialConsult) => {
  return request<{ id: string }>('patient/consult/order', 'POST', data)
}

// 获取支付地址
export const getPayUrl = (params: {
  paymentMethod: 0 | 1
  payCallback: string
  orderId: string
}) => {
  return request<{ payUrl: string }>('patient/consult/pay', 'POST', params)
}

export const getConsultOrderDetail = (orderId: string) => {
  return request<ConsultOrderItem>('patient/consult/order/detail', 'GET', {
    orderId,
  })
}

export const getPrescriptionPic = (id?: string) => {
  return request<{ url: string }>(`patient/consult/prescription/${id}`, 'GET')
}

export const evaluateConsultOrder = (data: {
  docId: string
  orderId: string
  score: number
  content: string
  anonymousFlag: 0 | 1
}) => {
  return request('patient/order/evaluate', 'POST', data)
}

export const getConsultOrderList = (params: ConsultOrderPreParams) => {
  return request<COnsultOrderPage>('patient/consult/order/list', 'GET', params)
}

export const cancelOrder = (id: string) => {
  return request(`patient/order/cancel/${id}`, 'PUT')
}

export const deleteOrder = (id: string) => {
  return request(`patient/order/${id}`, 'DELETE')
}
