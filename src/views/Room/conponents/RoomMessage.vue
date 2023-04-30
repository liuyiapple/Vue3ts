<template>
  <!-- 患者卡片 -->
  <div class="msg msg-illness" v-if="item.msgType === MsgType.CardPat">
    <div class="patient van-hairline--bottom">
      <p>
        {{ item.msg.consultRecord?.patientInfo.name }}
        {{ item.msg.consultRecord?.patientInfo.genderValue }}
        {{ item.msg.consultRecord?.patientInfo.age }} 岁
      </p>
      <p v-if="item.msg.consultRecord">
        {{ getIllnessTimeText(item.msg.consultRecord?.illnessTime) }} |
        {{ getConsultFlagText(item.msg.consultRecord?.consultFlag) }}
      </p>
    </div>
    <van-row>
      <van-col span="6">病情描述</van-col>
      <van-col span="18">{{ item.msg.consultRecord?.illnessDesc }}</van-col>
      <van-col span="6">图片</van-col>
      <van-col
        span="18"
        v-if="item.msg.consultRecord"
        @click="onPreviewImage(item.msg.consultRecord?.pictures)"
        >点击查看</van-col
      >
    </van-row>
  </div>
  <!-- 通知-通用 -->
  <div class="msg msg-tip" v-if="item.msgType === MsgType.Notify">
    <div class="content">
      <span>{{ item.msg.content }}</span>
    </div>
  </div>
  <!-- 通知-温馨提示 -->
  <div class="msg msg-tip" v-if="item.msgType === MsgType.NotifyTip">
    <div class="content">
      <span class="green">温馨提示：</span>
      <span>{{ item.msg.content }}</span>
    </div>
  </div>
  <!-- 通知-结束 -->
  <div
    class="msg msg-tip msg-tip-cancel"
    v-if="item.msgType === MsgType.NotifyCancel"
  >
    <div class="content">
      <span>{{ item.msg.content }}</span>
    </div>
  </div>
  <!-- 发送文字 -->
  <div
    class="msg msg-to"
    v-if="item.msgType === MsgType.MsgText && item.from === store.user?.id"
  >
    <div class="content">
      <div class="time">{{ formatTime(item.createTime) }}</div>
      <div class="pao">{{ item.msg.content }}</div>
    </div>
    <van-image :src="item.fromAvatar" />
  </div>
  <!-- 发送图片 -->
  <div
    class="msg msg-to"
    v-if="item.msgType === MsgType.MsgImage && item.from === store.user?.id"
  >
    <div class="content">
      <div class="time">{{ formatTime(item.createTime) }}</div>
      <van-image fit="contain" :src="item.msg.picture?.url" />
    </div>
    <van-image :src="item.fromAvatar" />
  </div>
  <!-- 接收文字 -->
  <div
    class="msg msg-from"
    v-if="item.msgType === MsgType.MsgText && item.from !== store.user?.id"
  >
    <van-image :src="item.fromAvatar" />
    <div class="content">
      <div class="time">{{ formatTime(item.createTime) }}</div>
      <div class="pao">{{ item.msg.content }}</div>
    </div>
  </div>
  <!-- 接收图片 -->
  <div
    class="msg msg-from"
    v-if="item.msgType === MsgType.MsgImage && item.from !== store.user?.id"
  >
    <van-image :src="item.fromAvatar" />
    <div class="content">
      <div class="time">{{ formatTime(item.createTime) }}</div>
      <van-image fit="contain" :src="item.msg.picture?.url" />
    </div>
  </div>
  <!-- 处方卡片 -->
  <div class="msg msg-recipe" v-if="item.msgType === MsgType.CardPre">
    <div class="content" v-if="item.msg.prescription">
      <div class="head van-hairline--bottom">
        <div class="head-tit">
          <h3>电子处方</h3>
          <p @click="onShowPre(item.msg.prescription.id)">
            原始处方 <van-icon name="arrow"></van-icon>
          </p>
        </div>
        <p>
          {{ item.msg.prescription?.name }}
          {{ item.msg.prescription.genderValue }}
          {{ item.msg.prescription.age }}岁
          {{ item.msg.prescription.diagnosis }}
        </p>
        <p>开方时间：{{ item.msg.prescription.createTime }}</p>
      </div>
      <div class="body">
        <div
          class="body-item"
          v-for="med in item.msg.prescription.medicines"
          :key="med.id"
        >
          <div class="durg">
            <p>{{ med.name }} {{ med.specs }}</p>
            <p>{{ med.usageDosag }}</p>
          </div>
          <div class="num">x{{ med.quantity }}</div>
        </div>
      </div>
      <div class="foot"><span>购买药品</span></div>
    </div>
  </div>
  <!-- 评价卡片，后期实现 -->
  <div
    class="msg msg-comment"
    v-if="
      item.msgType === MsgType.CardEva || item.msgType === MsgType.CardEvaForm
    "
  >
    <EvaluateCard :evaluateDoc="item.msg.evaluateDoc" />
  </div>
</template>
<script setup lang="ts">
defineProps<{
  item: Message
}>()
import dayjs from 'dayjs'
import { IllnessTime, MsgType } from '@/enums'
import { Message } from '@/types/room'
import { timeOptions, flagOptions } from '@/services/constants'
import { Image } from '@/types/consult'
import { showImagePreview, showToast } from 'vant'
import { useUserterStore } from '@/stores'
import { getPrescriptionPic } from '@/services/consult'
import EvaluateCard from './EvaluateCard.vue'
const store = useUserterStore()
const getIllnessTimeText = (time: IllnessTime) => {
  return timeOptions.find((item) => item.value === time)?.label
}
const getConsultFlagText = (flag: 0 | 1) => {
  return flagOptions.find((item) => item.value === flag)?.label
}
const onPreviewImage = (img: Image[]) => {
  if (img && img.length) {
    showImagePreview(img.map((item) => item.url))
  } else {
    showToast('暂无图片查看')
  }
}
const formatTime = (time: string) => dayjs(time).format('HH:mm')
const onShowPre = async (id?: string) => {
  const res = await getPrescriptionPic(id)
  showImagePreview([res.data.url])
}
</script>
<style lang="scss" scoped>
@import '@/styles/room.scss';
</style>