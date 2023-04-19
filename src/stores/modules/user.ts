import type { UserType } from '@/types/user'
import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useUserterStore = defineStore(
  'user',
  () => {
    const user = ref<UserType>()
    const setUser = (u: UserType) => {
      user.value = u
    }
    const delUser = () => {
      user.value = undefined
    }
    return {
      user,
      setUser,
      delUser,
    }
  },
  {
    persist: true,
  }
)
