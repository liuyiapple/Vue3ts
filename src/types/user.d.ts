export type UserType = {
  token: string
  id: string
  account: string
  avatar: string
}

export type CodeType = 'login' | 'registe' | 'changeMobile' | 'forgetmobile'

type OmitUserType = Omit<UserType, 'token'>

export type UserInfoType = OmitUserType & {
  likeNumber: number
  collectionNumber: number
  score: number
  couponNumber: number
  orderInfo: {
    paidNumber: number
    receivedNumber: number
    shippedNumber: number
    finishedNumber: number
  }
}

export type PatientType = {
  id?: string
  name: string
  idCard: string
  defaultFlag: 0 | 1
  gender: 0 | 1
  genderValue: string
  age: number
}
export type PatientListType = Patient[]
export type UserFormType = Omit<PatientType, 'age' | 'genderValue'>
