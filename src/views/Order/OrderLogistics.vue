<template>
  <div class="order-logistics-page">
    <div id="map">
      <div class="title">
        <van-icon name="arrow-left" @click="$router.back()" />
        <span>{{ logistics?.statusValue }}</span>
        <van-icon name="service" />
      </div>
      <div class="current">
        <p class="status">订单派送中 预计{{ logistics?.estimatedTime }}</p>
        <p class="predict">
          <span>{{ logistics?.name }}</span>
          <span>{{ logistics?.awbNo }}</span>
        </p>
      </div>
    </div>
    <div class="logistics">
      <p class="title">物流详情</p>
      <van-steps direction="vertical" :active="0">
        <van-step v-for="item in logistics?.list" :key="item.id">
          <p class="status">{{ item.statusValue }}</p>
          <p class="content">
            {{ item.content }}
          </p>
          <p class="time">{{ item.createTime }}</p>
        </van-step>
      </van-steps>
    </div>
  </div>
</template>
<script setup lang="ts">
import { getMedicalOrderLogistics } from '@/services/order'
import { Logistics } from '@/types/order'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import AMapLoader from '@amap/amap-jsapi-loader'
import StartPng from '@/assets/start.png'
import EndImg from '@/assets/end.png'
import CarImg from '@/assets/car.png'
const route = useRoute()

const logistics = ref<Logistics>()
onMounted(async () => {
  const res = await getMedicalOrderLogistics(route.params.id as string)
  console.log(res)
  logistics.value = res.data
  initMap()
})
window._AMapSecurityConfig = {
  securityJsCode: '0501dc00450c3a684862a29ec0c765a7',
}
const initMap = () => {
  AMapLoader.load({
    key: 'e7c46f3757a20aeea2cf2349ff7d0e83',
    version: '2.0',
  }).then((AMap) => {
    const map = new AMap.Map('map', {
      mapStyle: 'amap://styles/whitesmoke',
      // 缩放比例
      zoom: '12',
    })
    AMap.plugin('AMap.Driving', function () {
      const driving = new AMap.Driving({
        // 配置项
        map,
        showTraffic: false,
        hideMarkers: true,
      })
      if (
        logistics.value?.logisticsInfo &&
        logistics.value.logisticsInfo.length >= 2
      ) {
        // 判断 是否存在经纬度
        // 取出起始点
        const list = [...logistics.value?.logisticsInfo]

        // 标记函数
        const getMarker = (
          point: Location,
          image: string,
          width = 25,
          height = 30
        ) => {
          const icon = new AMap.Icon({
            size: new AMap.Size(width, height),
            image,
            imageSize: new AMap.Size(width, height),
          })
          const maker = new AMap.Marker({
            position: [point?.longitude, point?.latitude],
            icon: icon,
            offset: new AMap.Pixel(-width / 2, -30),
          })
          return maker
        }

        const start = list.shift()
        const startMarker = getMarker(start!, StartPng)
        map.add(startMarker)
        const end = list.pop()
        const endtMarker = getMarker(end!, EndImg)
        map.add(endtMarker)
        //  绘制起始点的坐标
        driving.search(
          [start?.longitude, start?.latitude],
          [end?.longitude, end?.latitude],
          // 途经
          { waypoints: list.map((item) => [item.longitude, item.latitude]) },
          () => {
            // 小车位置
            const curr = logistics.value?.currentLocationInfo
            const currMarker = getMarker(curr!, CarImg, 33, 20)
            map.add(currMarker)
            // 3s后 缩放到具体的位置
            setTimeout(() => {
              map.setFitView([currMarker])
              map.setZoom(10)
            }, 3000)
          }
        )
      }
    })
  })
}
</script>
<style lang="scss" scoped>
.order-logistics-page {
  --van-step-icon-size: 18px;
  --van-step-circle-size: 10px;
}
#map {
  height: 450px;
  background-color: var(--cp-bg);
  overflow: hidden;
  position: relative;
  .title {
    background-color: #fff;
    height: 46px;
    width: 355px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    padding: 0 15px;
    font-size: 16px;
    position: absolute;
    left: 10px;
    top: 10px;
    box-sizing: border-box;
    box-shadow: 0px 0px 22px 0px rgba(229, 229, 229, 0.5);
    z-index: 999;
    > span {
      flex: 1;
      text-align: center;
    }
    .van-icon {
      font-size: 18px;
      color: #666;
      &:last-child {
        color: var(--cp-primary);
      }
    }
  }
  .current {
    height: 80px;
    border-radius: 4px;
    background-color: #fff;
    height: 80px;
    width: 355px;
    box-sizing: border-box;
    padding: 15px;
    position: absolute;
    left: 10px;
    bottom: 10px;
    box-shadow: 0px 0px 22px 0px rgba(229, 229, 229, 0.5);
    z-index: 999;
    .status {
      font-size: 15px;
      line-height: 26px;
    }
    .predict {
      color: var(--cp-tip);
      font-size: 13px;
      margin-top: 5px;
      > span {
        padding-right: 10px;
      }
    }
  }
}
.logistics {
  padding: 0 10px 20px;
  .title {
    font-size: 16px;
    padding: 15px 5px 5px;
  }
  .van-steps {
    :deep(.van-step) {
      &::after {
        display: none;
      }
    }
    .status {
      font-size: 15px;
      color: var(--cp-text3);
      margin-bottom: 4px;
    }
    .content {
      font-size: 13px;
      color: var(--cp-tip);
      margin-bottom: 4px;
    }
    .time {
      font-size: 13px;
      color: var(--cp-tag);
    }
  }
}
</style>
