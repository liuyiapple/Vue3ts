import { request } from '@/utils/request'
import type {
  UserType,
  CodeType,
  UserInfoType,
  PatientListType,
  UserFormType,
} from '@/types/user'
export const loginByPassword = (mobile: string, password: string) => {
  return request<UserType>('login/password', 'POST', { mobile, password })
}

export const senCode = (mobile: string, type: CodeType) => {
  return request('code', 'GET', { mobile, type })
}

export const loginByMobile = (mobile: string, code: string) => {
  return request<UserType>('login', 'POST', { mobile, code })
}

export const getUserInfo = () => {
  return request<UserInfoType>('patient/myUser', 'GET')
}

export const getPatientList = () => {
  return request<PatientListType>('patient/myList', 'GET')
}

export const addPatient = (patient: UserFormType) => {
  return request('patient/add', 'POST', patient)
}

export const editPatient = (patient: UserFormType) => {
  return request('patient/update', 'PUT', patient)
}
export const delPatient = (id: string) => {
  return request(`/patient/del/${id}`, 'DELETE')
}
