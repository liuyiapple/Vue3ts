import { ConsultType } from '@/enums'
import type { ConsultIllnessType, PartialConsult } from '@/types/consult'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useConsultStore = defineStore(
  'consult',
  () => {
    // 问诊信息
    const consult = ref<PartialConsult>({})
    // 记录问诊类型
    const setType = (type: ConsultType) => (consult.value.type = type)
    // 记录问诊级别
    const setIllnessType = (type: 0 | 1) => (consult.value.illnessType = type)
    // 记录科室的
    const setDep = (depId: string) => (consult.value.depId = depId)
    // 记录病情
    const setIllness = (illness: ConsultIllnessType) => {
      consult.value.illnessDesc = illness.illnessDesc
      consult.value.illnessTime = illness.illnessTime
      consult.value.consultFlag = illness.consultFlag
      consult.value.pictures = illness.pictures
    }
    // 患者id
    const setPatientId = (id: string) => (consult.value.patientId = id)
    // 优惠卷
    const setCouponId = (id: string) => (consult.value.couponId = id)

    // 清理
    const clear = () => (consult.value = {})
    return {
      consult,
      setType,
      setIllnessType,
      setDep,
      setIllness,
      setPatientId,
      setCouponId,
      clear,
    }
  },
  {
    persist: true,
  }
)
