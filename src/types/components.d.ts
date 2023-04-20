import NavBar from '@/components/NavBar/index.vue'
import Icon from '@/components/Icon/index.vue'
declare module 'vue' {
  interface GlobalComponents {
    NavBar: typeof NavBar
    Icon: typeof Icon
  }
}
