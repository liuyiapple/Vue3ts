<template>
  <div class="room-page">
    <NavBar title="问诊室"></NavBar>
    <RoomeStatus :status="consult?.status" :countdown="consult?.countdown" />
    <van-pull-refresh v-model="loading" @refresh="onRefresh">
      <RoomMessage v-for="item in list" :key="item.id" :item="item" />
    </van-pull-refresh>
    <RoomAction
      :disabled="consult?.status !== OrderType.ConsultChat"
      @send-text="onSendText"
      @sent-image="onSendImage"
    />
  </div>
</template>
<script lang="ts" setup>
import { onMounted, onUnmounted } from 'vue'
import RoomeStatus from './conponents/RoomeStatus.vue'
import RoomAction from './conponents/RoomAction.vue'
import RoomMessage from './conponents/RoomMessage.vue'
import io, { Socket } from 'socket.io-client'
import { baseURL } from '@/utils/request'
import { useUserterStore } from '@/stores'
import { useRoute } from 'vue-router'
import type { TimeMessages, Message } from '@/types/room'
import { MsgType, OrderType } from '@/enums'
import { ref, nextTick, provide } from 'vue'
import { ConsultOrderItem, Image } from '@/types/consult'
import { getConsultOrderDetail } from '@/services/consult'
import dayjs from 'dayjs'
import { showToast } from 'vant'
const route = useRoute()
const store = useUserterStore()
const list = ref<Message[]>([])
let socket: Socket
const consult = ref<ConsultOrderItem>()
const initialMsg = ref(true)

const loadData = async () => {
  const res = await getConsultOrderDetail(route.query.orderId as string)
  consult.value = res.data
}
provide('consult', consult)
// 修改
const completeEva = (score: number) => {
  const item = list.value.find((item) => item.msgType === MsgType.CardEvaForm)
  if (item) {
    item.msg.evaluateDoc = { score }
    item.msgType = MsgType.CardEva
  }
}
provide('completeEva', completeEva)

onMounted(() => {
  loadData()

  socket = io(baseURL, {
    auth: {
      token: `Bearer ${store.user?.token}`,
    },
    query: {
      orderId: route.query.orderId,
    },
  })
  socket.on('connect', () => {
    console.log('连接成')
  })
  socket.on('disconnect', () => {
    console.log('关闭')
  })
  socket.on('error', () => {
    console.log('error')
  })

  socket.on('chatMsgList', ({ data }: { data: TimeMessages[] }) => {
    const arr: Message[] = []
    data.forEach((item, i) => {
      if (i === 0) time.value = item.createTime

      arr.push({
        msgType: MsgType.Notify,
        msg: {
          content: item.createTime,
        },
        createTime: item.createTime,
        id: item.createTime,
      })
      arr.push(...item.items)
    })
    loading.value = false
    if (!arr.length) return showToast('没有更多数据了')
    list.value.unshift(...arr)
    if (initialMsg.value) {
      socket.emit('updateMsgStatus', arr[arr.length - 1].id)
      nextTick(() => {
        window.scrollTo(0, document.body.scrollHeight)
        initialMsg.value = false
      })
    }
  })
  socket.on('statusChange', () => {
    loadData()
  })
  socket.on('receiveChatMsg', async (event) => {
    socket.emit('updateMsgStatus', event.id)
    list.value.push(event)
    await nextTick()
    window.scrollTo(0, document.body.scrollHeight)
  })
})
const onSendText = (text: string) => {
  socket.emit('sendChatMsg', {
    from: store.user?.id,
    to: consult.value?.docInfo.id,
    msgType: MsgType.MsgText,
    msg: {
      content: text,
    },
  })
}

const onSendImage = (img: Image) => {
  socket.emit('sendChatMsg', {
    from: store.user?.id,
    to: consult.value?.docInfo.id,
    msgType: MsgType.MsgImage,
    msg: {
      picture: img,
    },
  })
}
const loading = ref(false)
const time = ref(dayjs().format('YYYY-MM-DD HH:mm:ss'))
const onRefresh = () => {
  socket.emit('getChatMsgList', 20, time.value, route.query.orderId)
}
onUnmounted(() => {
  socket.close()
})
</script>
<style lang="scss" scoped>
.room-page {
  padding-top: 90px;
  padding-bottom: 60px;
  min-height: 100vh;
  box-sizing: border-box;
  background-color: var(--cp-bg);
  .van-pull-refresh {
    width: 100%;
    min-height: calc(100vh - 150px);
  }
}
</style>
