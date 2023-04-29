import type {
  KnowledgePageType,
  KnowledgeParamsType,
  DoctorParamsType,
  DoctorPageType,
  FollowType,
  TopDep,
  Image,
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
