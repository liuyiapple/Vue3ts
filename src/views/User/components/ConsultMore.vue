<template>
  <div class="consult-more">
    <van-popover
      v-model:show="showPopover"
      :actions="actions"
      @select="onSelect"
      placement="top-start"
    >
      <template #reference> 更多 </template>
    </van-popover>
  </div>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue'
const showPopover = ref(false)
const props = defineProps<{
  disabled?: boolean
}>()
const emit = defineEmits<{
  (e: 'on-preview'): void
  (e: 'on-delete'): void
}>()
const actions = computed(() => [
  { text: '查看处方', disabled: props.disabled },
  { text: '删除订单' },
])
const onSelect = (action: { text: string }, i: number) => {
  if (i === 0) {
    // onShowPre(props.item.prescriptionId)
    emit('on-preview')
  }
  if (i === 1) {
    // deleteConsultOrder(props.item)
    emit('on-delete')
  }
}
</script>
<style lang="scss" scoped>
.consult-more {
  color: var(--cp-tag);
  flex: 1;
  font-size: 13px;
}
</style>
