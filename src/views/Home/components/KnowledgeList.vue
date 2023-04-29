<template>
  <div class="knowledge-list">
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="我也是有底线的"
      @load="onLoad"
    >
      <KnowledgeCard
        v-for="(item, index) in list"
        :key="item.id"
        :item="item"
      />
    </van-list>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import KnowledgeCard from './KnowledgeCard.vue'
import type {
  KnowledgePropsType,
  KnowledgeParamsType,
  KnowledgeListType,
} from '@/types/consult'
import { getKnowledgePage } from '@/services/consult'
import { onMounted } from 'vue'
const props = defineProps<{
  type: KnowledgePropsType
}>()

const loading = ref(false)
const finished = ref(false)
const list = ref<KnowledgeListType>([])
const params = ref<KnowledgeParamsType>({
  type: props.type,
  current: 1,
  pageSize: 5,
})
const onLoad = async () => {
  const res = await getKnowledgePage(params.value)
  list.value?.push(...res.data.rows)
  if (params.value.current >= res.data.pageTotal) {
    finished.value = true
  } else {
    params.value.current++
  }
  loading.value = false
}
</script>
<style lang="scss" scoped>
.knowledge-list {
  padding: 0 15px;
}
</style>
