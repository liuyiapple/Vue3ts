<template>
  <div class="login-page">
    <nav-bar
      right-text="注册"
      @click-right="$router.push('/register')"
    ></nav-bar>
    <!-- 头部 -->
    <div class="login-head">
      <h3>{{ isPass ? '密码登录' : '短信登陆' }}</h3>
      <a href="javascript:;">
        <span @click="isPass = !isPass">
          {{ isPass ? '短信验证码登录' : '密码登陆' }}
        </span>
        <van-icon name="arrow"></van-icon>
      </a>
    </div>
    <!-- 表单 -->
    <van-form autocomplete="off" @submit="onSubmit" ref="form">
      <van-field
        name="mobile"
        placeholder="请输入手机号"
        type="tel"
        v-model="mobile"
        :rules="mobileRles"
      />
      <van-field
        placeholder="请输入密码"
        :type="isShow ? 'text' : 'password'"
        v-model="password"
        :rules="passwordRules"
        v-if="isPass"
      >
        <template #button>
          <Icon
            style="margin-right: 10px"
            :name="`login-eye-${isShow ? 'on' : 'off'}`"
            @click="isShow = !isShow"
          />
        </template>
      </van-field>
      <van-field
        v-model="code"
        center
        clearable
        placeholder="请输入短信验证码"
        v-else
        :rules="codeRules"
      >
        <template #button>
          <van-button
            size="small"
            type="primary"
            @click="onSend"
            :disabled="timer > 0"
          >
            {{ timer > 0 ? `${timer}S后发送` : '发送验证码' }}
          </van-button>
        </template>
      </van-field>
      <div class="cp-cell">
        <van-checkbox v-model="agree">
          <span>我已同意</span>
          <a href="javascript:;">用户协议</a>
          <span>及</span>
          <a href="javascript:;">隐私条款</a>
        </van-checkbox>
      </div>
      <div class="cp-cell">
        <van-button block round type="primary" native-type="submit">
          登 录
        </van-button>
      </div>
      <div class="cp-cell">
        <a href="javascript:;">忘记密码？</a>
      </div>
    </van-form>
    <!-- 底部 -->
    <div class="login-other">
      <van-divider>第三方登录</van-divider>
      <div class="icon">
        <img src="@/assets/qq.svg" alt="" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { mobileRles, passwordRules, codeRules } from '@/utils/rules'
import { FormInstance, showSuccessToast, showToast } from 'vant'
import { useRoute, useRouter } from 'vue-router'
import { loginByPassword, senCode, loginByMobile } from '@/services/user'
import { useUserterStore } from '@/stores'
import { onUnmounted } from 'vue'

const store = useUserterStore()
const mobile = ref<string>('13211112222')
const password = ref<string>('abc12345')
const code = ref<string>('')
const agree = ref<boolean>(false)
const isPass = ref<boolean>(true)
const form = ref<FormInstance>()
const isShow = ref<boolean>(false)
// 路由实例
const router = useRouter()
console.log(router)

// 路由信息
const route = useRoute()
console.log(route.meta)
const onSubmit = async () => {
  if (!agree.value) return showToast('勾选同意协议')
  const res = isPass.value
    ? await loginByPassword(mobile.value, password.value)
    : await loginByMobile(mobile.value, code.value)
  showSuccessToast('登陆成功')
  store.setUser(res.data)
  router.replace((route.query.returnUrl as string) || '/user')
}

const timer = ref<number>(0)
let timerInterval: number
// 短信验证码
const onSend = async () => {
  if (timer.value > 0) return
  // 因为这里返回的是Promise ，所以，当校验不成功，Promise 处于失败的状态，下面的就不执行了
  await form.value?.validate('mobile')
  const { data } = await senCode(mobile.value, 'login')
  showToast('发送成功')
  timer.value = 60
  timerInterval = setInterval(() => {
    timer.value--
    if (timer.value <= 0) clearInterval(timerInterval)
  }, 1000)
  console.log(data)
}
onUnmounted(() => {
  clearInterval(timerInterval)
})
</script>

<style lang="scss" scoped>
.login {
  &-page {
    padding-top: 46px;
  }
  &-head {
    display: flex;
    padding: 30px 30px 50px;
    justify-content: space-between;
    align-items: flex-end;
    line-height: 1;
    h3 {
      font-weight: normal;
      font-size: 24px;
    }
    a {
      font-size: 15px;
    }
  }
  &-other {
    margin-top: 60px;
    padding: 0 30px;
    .icon {
      display: flex;
      justify-content: center;
      img {
        width: 36px;
        height: 36px;
        padding: 4px;
      }
    }
  }
}
.van-form {
  padding: 0 14px;
  .cp-cell {
    height: 52px;
    line-height: 24px;
    padding: 14px 16px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    .van-checkbox {
      a {
        color: var(--cp-primary);
        padding: 0 5px;
      }
    }
  }
  .btn-send {
    color: var(--cp-primary);
    &.active {
      color: rgba(22, 194, 163, 0.5);
    }
  }
}
</style>
