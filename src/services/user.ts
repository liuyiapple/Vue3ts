import { request } from '@/utils/request'
import type { UserType, CodeType } from '@/types/user'
export const loginByPassword = (mobile: string, password: string) => {
  return request<UserType>('login/password', 'POST', { mobile, password })
}

export const senCode = (mobile: string, type: CodeType) => {
  return request('code', 'GET', { mobile, type })
}

export const loginByMobile = (mobile: string, code: string) => {
  return request<UserType>('login', 'POST', { mobile, code })
}
