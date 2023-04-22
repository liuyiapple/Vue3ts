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

const nameRules: FieldRule[] = [
  { required: true, message: '请输入真实的姓名' },
  { pattern: /^(?:[\u4e00-\u9fa5·]{2,16})$/, message: '请输入正确的姓名' },
]
const idCardRules: FieldRule[] = [
  { required: true, message: '请输入身份证号码' },
  {
    pattern:
      /^[1-9]\d{5}(?:18|19|20)\d{2}(?:0[1-9]|10|11|12)(?:0[1-9]|[1-2]\d|30|31)\d{3}[\dXx]$/,
    message: '请输入正确的身份证号码',
  },
]
export { mobileRles, passwordRules, codeRules, nameRules, idCardRules }
