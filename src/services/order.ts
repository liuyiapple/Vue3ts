import { AddressItem, Logistics, OrderDetail, OrderPre } from '@/types/order'
import { request } from '@/utils/request'

export const getMedicalOrder = (params: { prescriptionId: string }) => {
  return request<OrderPre>('patient/medicine/order/pre', 'GET', params)
}

export const getAddressList = () => {
  return request<AddressItem[]>('patient/order/address', 'GET')
}

export const createMedicalOrder = (data: {
  id?: string
  addressId?: string
  couponId?: string
}) => {
  return request<{ id: string }>('/patient/medicine/order', 'POST', data)
}

export const getMedicalOrderDetail = (id: string) => {
  return request<OrderDetail>(`/patient/medicine/order/detail/${id}`, 'GET')
}

export const getMedicalOrderLogistics = (id: string) => {
  return request<Logistics>(`/patient/order/${id}/logistics`, 'GET')
}
