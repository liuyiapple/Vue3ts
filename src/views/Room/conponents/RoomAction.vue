<template>
  <div class="room-action">
    <van-field
      type="text"
      class="input"
      :border="false"
      placeholder="问医生"
      autocomplete="off"
      :disabled="disabled"
      v-model="text"
      @keyup.enter="senText"
    />
    <van-uploader
      :after-read="sentImage"
      :preview-image="false"
      :disabled="disabled"
    >
      <Icon name="consult-img" />
    </van-uploader>
  </div>
</template>
<script setup lang="ts">
import { uploadImage } from '@/services/consult'
import { Image } from '@/types/consult'
import { showLoadingToast } from 'vant'
import { UploaderAfterRead } from 'vant/lib/uploader/types'
import { ref } from 'vue'
defineProps<{
  disabled: boolean
}>()
const emit = defineEmits<{
  (e: 'sendText', text: string): void
  (e: 'sentImage', image: Image): void
}>()
const text = ref('')
const senText = () => {
  emit('sendText', text.value)
  text.value = ''
}
// image
const sentImage: UploaderAfterRead = async (item) => {
  if (Array.isArray(item)) return
  if (!item.file) return
  const t = showLoadingToast({
    message: '上传中',
    duration: 0,
  })
  const res = await uploadImage(item.file)
  t.close()
  emit('sentImage', res.data)
}
</script>
<style lang="scss" scoped>
.room-action {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 60px;
  background-color: #fff;
  display: flex;
  align-items: center;
  padding: 0 16px;
  z-index: 1;
  box-sizing: border-box;
  .input {
    background-color: var(--cp-bg);
    border: none;
    border-radius: 25px;
    margin-right: 10px;
    padding: 8px 15px;
  }
  .cp-icon {
    width: 24px;
    height: 24px;
  }
}
</style>
