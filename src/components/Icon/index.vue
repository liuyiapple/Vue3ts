<template>
  <svg aria-hidden="true" class="icon">
    <use :href="`#icon-${name}`"></use>
  </svg>
</template>
<script lang="ts" setup>
import { reactive, toRef, ref } from 'vue'
defineProps<{
  name: string
}>()
</script>
<style lang="scss" scoped>
.icon {
  width: 1rem;
  height: 1rem;
}
</style>
