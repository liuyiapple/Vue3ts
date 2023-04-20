<template>
  <van-nav-bar
    fixed
    left-arrow
    :title="title"
    :right-text="rightText"
    @click-right="rightClick"
    @click-left="leftClick"
  ></van-nav-bar>
</template>
<script lang="ts" setup>
import { useRouter } from 'vue-router'
defineProps<{
  title?: string
  rightText?: string
}>()

const emit = defineEmits<{
  (e: 'clickRight'): void
}>()

const rightClick = () => {
  emit('clickRight')
}

const router = useRouter()
const leftClick = () => {
  if (history.state?.back) {
    router.back()
  } else {
    router.push('/')
  }
}
</script>
<style lang="scss" scoped>
:deep() {
  .van-nav-bar {
    &__arrow {
      color: var(--cp-text1);
      font-size: 18px;
    }
    &__title {
      font-size: 15px;
    }
  }
}
</style>
