<template>
  <div class="layout-page">
    <!-- 二级路由的出口 -->
    <router-view></router-view>
    <van-tabbar route>
      <van-tabbar-item to="/home">
        <template #icon="{ active }">
          <Icon :name="`home-index-${active ? 'active' : 'default'}`" />
        </template>
        首页
      </van-tabbar-item>
      <van-tabbar-item to="/article">
        <template #icon="{ active }">
          <Icon :name="`home-article-${active ? 'active' : 'default'}`" />
        </template>
        健康百科
      </van-tabbar-item>
      <van-tabbar-item to="/notify" :badge="unReadMsg || ''">
        <template #icon="{ active }">
          <Icon :name="`home-notice-${active ? 'active' : 'default'}`" />
        </template>
        消息通知
      </van-tabbar-item>
      <van-tabbar-item to="/user">
        <template #icon="{ active }">
          <Icon :name="`home-mine-${active ? 'active' : 'default'}`" />
        </template>
        我的
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>
<script lang="ts" setup>
import { getUnreadMessageData } from '@/services/user'
import { onMounted, ref } from 'vue'
const unReadMsg = ref<number>(0)
onMounted(async () => {
  const res = await getUnreadMessageData()
  console.log(res.data)
  unReadMsg.value = res.data
})
</script>
<style lang="scss" scoped>
.layout-page {
  :deep() {
    .van-tabbar-item {
      &__icon {
        font-size: 21px;
      }
      &__text {
        font-size: 11px;
      }
      &:not(.van-tabbar-item--active) {
        color: var(--cp-text3);
      }
    }
  }
}
</style>
