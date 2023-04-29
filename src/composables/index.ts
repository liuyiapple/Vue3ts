//  关注
import { ref } from 'vue'
import type { FollowType } from '@/types/consult'
import { followOrUnfollow } from '@/services/consult'
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
