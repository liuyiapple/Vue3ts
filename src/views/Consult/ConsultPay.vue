<template>
  <div class="consult-pay-page" v-if="payInfo && patient">
    <nav-bar title="支付" />
    <div class="pay-info">
      <p class="tit">图文问诊 {{ payInfo.payment }} 元</p>
      <img class="img" src="@/assets/avatar-doctor.svg" />
      <p class="desc">
        <span>极速问诊</span>
        <span>自动分配医生</span>
      </p>
    </div>
    <van-cell-group>
      <van-cell title="优惠券" :value="`-¥${payInfo.couponDeduction}`" />
      <van-cell title="积分抵扣" :value="`-¥${payInfo.pointDeduction}`" />
      <van-cell
        title="实付款"
        :value="`¥${payInfo.actualPayment}`"
        class="pay-price"
      />
    </van-cell-group>
    <div class="pay-space"></div>
    <van-cell-group>
      <van-cell
        title="患者信息"
        :value="`${patient.name} | ${patient.genderValue} | ${patient.age}岁`"
      ></van-cell>
      <van-cell title="病情描述" :label="store.consult.illnessDesc"></van-cell>
    </van-cell-group>
    <div class="pay-schema">
      <van-checkbox v-model="agree"
        >我已同意 <span class="text">支付协议</span></van-checkbox
      >
    </div>
    <van-submit-bar
      button-type="primary"
      :price="payInfo.actualPayment * 100"
      button-text="立即支付"
      text-align="left"
      @click="submit"
      :loading="loading"
    />
    <!-- 支付 -->
    <PaySheet
      v-model:show="show"
      :order-id="orderId"
      :actual-payment="payInfo.actualPayment"
      :on-close="onClose"
      pay-callback="/room"
    />
  </div>
  <div class="consult-pay-page" v-else>
    <nav-bar title="支付"></nav-bar>
    <van-skeleton title :row="10" style="margin-top: 18px" />
  </div>
</template>
<script setup lang="ts">
import { createConsultOrder, getConsultOrderPre } from '@/services/consult'
import { getPatientDetail } from '@/services/user'
import { useConsultStore } from '@/stores'
import type { PartialConsult } from '@/types/consult'
import { ConsultOrderPerData } from '@/types/consult'
import { PatientType } from '@/types/user'
import { showConfirmDialog, showDialog, showToast } from 'vant'
import { onMounted, ref } from 'vue'
import { onBeforeRouteLeave, useRouter } from 'vue-router'
const router = useRouter()
const store = useConsultStore()
const payInfo = ref<ConsultOrderPerData>()
const agree = ref(false)
const show = ref(false)
const loading = ref(false)

const orderId = ref()
const loadData = async () => {
  const res = await getConsultOrderPre({
    type: store.consult.type,
    illnessType: store.consult.illnessType,
  })
  payInfo.value = res.data
  store.setCouponId(res.data.couponId)
  console.log(res)
}
const patient = ref<PatientType>()
const loadPatientData = async () => {
  if (!store.consult.patientId) return
  const res = await getPatientDetail(store.consult.patientId)
  patient.value = res.data
}
const submit = async () => {
  if (!agree.value) return showToast('请勾选同意支付协议')
  loading.value = true
  const res = await createConsultOrder(store.consult)
  orderId.value = res.data.id
  store.clear()
  loading.value = false
  show.value = true
}
type Key = keyof PartialConsult
onMounted(() => {
  // 生成订单需要的信息不完整的提示
  const validKeys: Key[] = [
    'type',
    'illnessType',
    'depId',
    'illnessDesc',
    'illnessTime',
    'consultFlag',
    'patientId',
  ]
  const valid = validKeys.every((key) => store.consult[key] !== undefined)
  if (!valid) {
    return showDialog({
      title: '温馨提示',
      message:
        '问诊信息不完整，需要重新填写，如有未支付的问诊订单可在问诊记录中继续支付',
      closeOnClickOverlay: false,
    }).then(() => {
      router.push('/')
    })
  }
  loadData()
  loadPatientData()
})

// 引导
onBeforeRouteLeave(() => {
  if (orderId.value) return false
})
const onClose = () => {
  return showConfirmDialog({
    title: '温馨提示',
    message: '取消支付将无法获得医生回复，医生接诊名额有限，是否确认关闭？',
    cancelButtonText: '狠心离开',
    confirmButtonText: '继续支付',
  })
    .then(() => {
      return false
    })
    .catch(() => {
      orderId.value = ''
      router.push('/user/consult')
      return true
    })
}
</script>
<style lang="scss" scoped>
.consult-pay-page {
  padding: 46px 0 50px 0;
}
.pay-info {
  display: flex;
  padding: 15px;
  flex-wrap: wrap;
  align-items: center;
  .tit {
    width: 100%;
    font-size: 16px;
    margin-bottom: 10px;
  }
  .img {
    margin-right: 10px;
    width: 38px;
    height: 38px;
    border-radius: 4px;
    overflow: hidden;
  }
  .desc {
    flex: 1;
    > span {
      display: block;
      color: var(--cp-tag);
      &:first-child {
        font-size: 16px;
        color: var(--cp-text2);
      }
    }
  }
}
.pay-price {
  ::v-deep() {
    .vam-cell__title {
      font-size: 16px;
    }
    .van-cell__value {
      font-size: 16px;
      color: var(--cp-price);
    }
  }
}
.pay-space {
  height: 12px;
  background-color: var(--cp-bg);
}
.pay-schema {
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  .text {
    color: var(--cp-primary);
  }
}
::v-deep() {
  .van-submit-bar__button {
    font-weight: normal;
    width: 160px;
  }
}
</style>
