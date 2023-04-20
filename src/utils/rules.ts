import { FieldRule } from 'vant'

const mobileRles: FieldRule[] = [
  { required: true, message: '请输入手机号' },
  { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' },
]
const passwordRules: FieldRule[] = [
  { required: true, message: '请输入密码' },
  { pattern: /^\w{8,24}$/, message: '密码为8-24个字符' },
]

const codeRules: FieldRule[] = [
  { required: true, message: '请输入短信验证码' },
  { pattern: /^\d{6}$/, message: '验证码为6位数字' },
]

export { mobileRles, passwordRules, codeRules }
