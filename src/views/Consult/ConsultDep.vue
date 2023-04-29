<template>
  <div class="consult-dep-page">
    <NavBar title="选择科室" />
    <div class="wrapper">
      <van-sidebar v-model="active">
        <van-sidebar-item
          v-for="item in allDep"
          :title="item.name"
          :key="item.id"
        />
      </van-sidebar>
      <div class="sub-dep">
        <router-link
          to="/consult/illness"
          v-for="subItem in subDep"
          :key="subItem.id"
          @click="store.setDep(subItem.id)"
          >{{ subItem.name }}</router-link
        >
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import type { TopDep } from '@/types/consult'
import { onMounted } from 'vue'
import { getAllDep } from '@/services/consult'
import { computed } from 'vue'
import { useConsultStore } from '@/stores'
const store = useConsultStore()
const active = ref(0)
const allDep = ref<TopDep[]>([])
onMounted(async () => {
  const res = await getAllDep()
  allDep.value = res.data
})
const subDep = computed(() => allDep.value[active.value]?.child)
</script>

<style lang="scss" scoped>
.van-sidebar {
  width: 114px;
  &-item {
    padding: 14px;
    color: var(--cp-tag);
    &--select {
      color: var(--cp-main);
      font-weight: normal;
      &::before {
        display: none;
      }
    }
  }
}
.consult-dep-page {
  padding-top: 46px;
  .wrapper {
    height: calc(100vh - 46px);
    overflow: hidden;
    display: flex;
    .sub-dep {
      flex: 1;
      height: 100%;
      overflow-y: auto;
      > a {
        display: block;
        padding: 14px 30px;
        color: var(--cp-dark);
      }
    }
  }
}
</style>
