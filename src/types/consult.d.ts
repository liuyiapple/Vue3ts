import { ConsultType, IllnessTime, OrderType } from '@/enums'
import { PatientType } from './user'

export type KnowledgeType = {
  id: string
  title: string
  coverUrl: string[]
  topics: string[]
  collectionNumber: number
  creatorName: string
  creatorHospatalName: string
  creatorAvatar: string
  likeFlag: 0 | 1
  content: string
  creatorDep: string
  creatorTitles: string
  creatorId: string
  commentNumber: number
}

// 文章列表
export type KnowledgeListType = KnowledgeType[]

// 文章列表带分页
export type KnowledgePageType = {
  pageTotal: number
  total: number
  rows: KnowledgeListType
}

// props 类型
export type KnowledgePropsType = 'like' | 'recommend' | 'fatReduction' | 'food'

export type KnowledgeParamsType = {
  type: KnowledgePropsType
  current: number
  pageSize: number
}

// 医生卡片类型
export type DoctorType = {
  id: string
  name: string
  avatar: string
  hospitalName: string
  gradeName: string
  depName: string
  positionalTitles: string
  likeFlag: 0 | 1
  serviceFee: number
  consultationNum: number
  score: number
  mahor: string
}

export type DoctorList = DoctorType[]

// 医生请求参数
export type DoctorParamsType = Omit<KnowledgeParamsType, 'type'>

// 分页
export type DoctorPageType = {
  pageTotal: number
  total: number
  rows: DoctorList
}

// 关注类型
export type FollowType = 'topic' | 'knowledge' | 'doc' | 'disease'

// 图片
export type Image = {
  id: string
  url: string
}

// 问诊记录
export type Consult = {
  id: string
  type: ConsultType
  illnessType: 0 | 1
  depId: string
  illnessDesc: IllnessTime
  consultFlag: 0 | 1
  pictures: Image[]
  patientId: string
  couponId: string
  illnessTime: string
}

// 可选
export type PartialConsult = Partial<Consult>

// 必选
type RequireConsult = Required<Consult>

// 科室 二级科室

export type SubDep = {
  id: string
  name: string
}

export type TopDep = SubDep & {
  child: SubDep[]
}
export type ConsultIllnessType = Pink<
  PartialConsult,
  'illnessDesc' | 'pictures' | 'consultFlag' | 'illnessTime'
>

// 预支付
export type ConsultOrderPreParams = Pick<PartialConsult, 'type' | 'illnessType'>

// 问诊订单的预处理
export type ConsultOrderPerData = {
  /** 积分 */
  pointDeduction: number
  /** 优惠卷 */
  couponDeduction: number
  /** 优惠卷Id */
  couponId: string
  /** 需支付 */
  payment: number
  /** 实付款 */
  actualPayment: number
}
// 问诊订单单项信息
export type ConsultOrderItem = Consult & {
  /** 创建时间 */
  createTime: string
  /** 医生信息 */
  docInfo?: Doctor
  /** 患者信息 */
  patientInfo: PatientType
  /** 订单编号 */
  orderNo: string
  /** 订单状态 */
  status: OrderType
  /** 状态文字 */
  statusValue: string
  /** 类型问诊文字 */
  typeValue: string
  /** 倒计时时间 */
  countdown: number
  /** 处方ID */
  prescriptionId?: string
  /** 评价ID */
  evaluateId: number
  /** 应付款 */
  payment: number
  /** 优惠券抵扣 */
  couponDeduction: number
  /** 积分抵扣 */
  pointDeduction: number
  /** 实付款 */
  actualPayment: number
}
export type ConsultOrderListParams = DoctorParamsType & {
  type: ConsultType
}

export type COnsultOrderPage = {
  total: number
  pageTotal: number
  rows: ConsultOrderItem[]
}
