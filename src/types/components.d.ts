import NavBar from '@/components/NavBar/index.vue'
import Icon from '@/components/Icon/index.vue'
import RedioBtn from '@/components/RedioBtn/index.vue'
import PaySheet from '@/components/PaySheet/index.vue'
declare module 'vue' {
  interface GlobalComponents {
    NavBar: typeof NavBar
    Icon: typeof Icon
    RedioBtn: typeof RedioBtn
    PaySheet: typeof PaySheet
  }
}
