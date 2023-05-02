//  关注
import { OrderType } from '@/enums'
import {
  cancelOrder,
  deleteOrder,
  followOrUnfollow,
  getPrescriptionPic,
} from '@/services/consult'
import { getMedicalOrderDetail } from '@/services/order'
import type { ConsultOrderItem, FollowType } from '@/types/consult'
import { OrderDetail } from '@/types/order'
import { showFailToast, showImagePreview, showSuccessToast } from 'vant'
import { onMounted, ref } from 'vue'
export const useFollowFn = (type: FollowType = 'doc') => {
  const loading = ref(false)
  const followHandle = async (item: { id: string; likeFlag: 0 | 1 }) => {
    loading.value = true
    try {
      await followOrUnfollow(item.id, type)
      item.likeFlag = item.likeFlag == 1 ? 0 : 1
    } finally {
      loading.value = false
    }
  }
  return { loading, followHandle }
}

// 查看图片
export const useShowPresctiption = () => {
  const onShowPre = async (id?: string) => {
    const res = await getPrescriptionPic(id)
    showImagePreview([res.data.url])
  }
  return {
    onShowPre,
  }
}

export const useCancelOrder = () => {
  const loading = ref(false)
  const cancelConsultOrder = async (item: ConsultOrderItem) => {
    try {
      loading.value = true
      await cancelOrder(item.id)
      item.status = OrderType.ConsultCancel
      item.statusValue = '已取消'
      showSuccessToast('取消成功')
    } catch (error) {
      showFailToast('取消失败')
    } finally {
      loading.value = false
    }
  }
  return {
    cancelConsultOrder,
    loading,
  }
}

// 删除订单
export const useDeleteOrder = (cb: () => void) => {
  const deleteLoading = ref(false)
  const deleteConsultOrder = async (item: ConsultOrderItem) => {
    try {
      deleteLoading.value = true
      await deleteOrder(item.id)
      showSuccessToast('删除成功')
      cb && cb()
    } catch (error) {
      showFailToast('删除失败')
    } finally {
      deleteLoading.value = true
    }
  }
  return {
    deleteLoading,
    deleteConsultOrder,
  }
}

export const useOrderDetail = (id: string) => {
  const order = ref<OrderDetail>()
  const loading = ref(false)
  loading.value = true
  onMounted(async () => {
    try {
      const res = await getMedicalOrderDetail(id)
      order.value = res.data
    } catch (error) {
      loading.value = true
    } finally {
      loading.value = true
    }
  })
  return {
    order,
    loading,
  }
}
