<template>
  <div class="consult-list">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <consult-item
        @on-delete="onDelete"
        v-for="item in list"
        :key="item.id"
        :item="item"
      />
    </van-list>
  </div>
</template>
<script setup lang="ts">
import { ConsultType } from '@/enums'
import ConsultItem from './ConsultItem.vue'
import { ref } from 'vue'
import type { ConsultOrderListParams, ConsultOrderItem } from '@/types/consult'
import { getConsultOrderList } from '@/services/consult'
const props = defineProps<{
  type: ConsultType
}>()

// 加载更多
const loading = ref(false)
const finished = ref(false)
const list = ref<ConsultOrderItem[]>([])
const onLoad = async () => {
  const res = await getConsultOrderList(params.value)
  list.value.push(...res.data.rows)
  if (params.value.current < res.data.pageTotal) {
    params.value.current++
  } else {
    finished.value = true
  }
  loading.value = true
}
const params = ref<ConsultOrderListParams>({
  type: props.type,
  current: 1,
  pageSize: 10,
})
const onDelete = (id: string) => {
  list.value = list.value.filter((item) => item.id !== id)
  if (!list.value.length) onLoad()
}
</script>
<style lang="scss" scoped>
.consult-list {
  padding: 10px 15px;
}
</style>
