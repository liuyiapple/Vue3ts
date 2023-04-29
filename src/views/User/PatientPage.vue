<template>
  <div class="patient-page">
    <nav-bar :title="isChange ? '选择患者' : '家庭档案'"></nav-bar>
    <!-- 头部提示 -->
    <div class="patient-change" v-if="isChange">
      <h3>请选择患者信息</h3>
      <p>以便医生给出更准确的治疗，信息仅医生可见</p>
    </div>
    <div class="patient-list">
      <div
        class="patient-item"
        v-for="(item, index) in list"
        :key="item.id"
        @click="selectedPatient(item)"
        :class="{ selected: patientId === item.id }"
      >
        <div class="info">
          <span class="name">{{ item.name }}</span>
          <span class="id">{{
            item.idCard.replace(/^(.{6}).+(.{4})$/, '$1********$2')
          }}</span>
          <span>{{ item.genderValue }}</span>
          <span>{{ item.age }}岁</span>
        </div>
        <div class="icon" @click.stop="clickShowPopup(item)">
          <Icon name="user-edit" />
        </div>
        <div class="tag" v-if="item.defaultFlag === 1">默认</div>
      </div>
      <div class="patient-add" v-if="list.length < 9" @click="clickShowPopup()">
        <Icon name="user-add" />
        <p>添加患者</p>
      </div>
      <div class="patient-tip">最多可添加 6 人</div>
    </div>
    <!-- 底部按钮 -->
    <div class="patient-next" v-if="isChange">
      <van-button type="primary" round block @click="next">下一步</van-button>
    </div>
    <!-- 右侧弹出 -->
    <van-popup v-model:show="showRight" position="right">
      <template #default>
        <nav-bar
          :title="showTitle"
          right-text="保存"
          :back="() => (showRight = false)"
          @clickRight="onSubMit"
        />
        <van-form autocomplete="off" ref="form">
          <van-field
            label="真实姓名"
            placeholder="请输入真实姓名"
            v-model="patient.name"
            :rules="nameRules"
          />
          <van-field
            label="身份证号"
            placeholder="请输入身份证号"
            v-model="patient.idCard"
            :rules="idCardRules"
          />
          <van-field label="性别" class="pb4">
            <!-- 单选按钮组件 -->
            <template #input>
              <redio-btn :options="options" v-model="patient.gender" />
            </template>
          </van-field>
          <van-field label="默认就诊人">
            <template #input>
              <van-checkbox :icon-size="18" round v-model="defaultFlag" />
            </template>
          </van-field>
        </van-form>
        <van-action-bar>
          <van-action-bar-button
            text="删除用户"
            type="danger"
            @click="delPatientHandle"
          />
        </van-action-bar>
      </template>
    </van-popup>
  </div>
</template>
<script setup lang="ts">
import {
  getPatientList,
  addPatient,
  editPatient,
  delPatient,
} from '@/services/user'
import type { PatientListType, UserFormType, PatientType } from '@/types/user'
import { ref, onMounted, computed } from 'vue'
import { nameRules, idCardRules } from '@/utils/rules'
import {
  FormInstance,
  showConfirmDialog,
  showSuccessToast,
  showToast,
} from 'vant'
import { useRoute, useRouter } from 'vue-router'
import { useConsultStore } from '@/stores'
const store = useConsultStore()
const list = ref<PatientListType>([])
onMounted(async () => {
  const res = await getPatientList()
  list.value = res.data
  if (isChange.value && list.value.length) {
    const defaultPatient = list.value.find((item) => item.defaultFlag == 1)
    if (defaultPatient) patientId.value = defaultPatient.id
    else patientId.value = list.value[0].id
  }
})
const options = [
  { label: '男', value: 1 },
  { label: '女', value: 0 },
]
const showRight = ref(false)
const showTitle = ref('添加患者')
const clickShowPopup = (item?: UserFormType) => {
  if (item) {
    showTitle.value = '编辑患者'
    const { id, name, idCard, gender, defaultFlag } = item
    patient.value = { id, name, idCard, gender, defaultFlag }
    showRight.value = true
  } else {
    showTitle.value = '添加患者'
    patient.value = { ...initPatient }
    showRight.value = true
  }
}
const initPatient: UserFormType = {
  name: '',
  idCard: '',
  defaultFlag: 0,
  gender: 0,
}
const patient = ref<UserFormType>({ ...initPatient })

const defaultFlag = computed({
  get: () => (patient.value.defaultFlag == 1 ? true : false),
  set: (value) => (patient.value.defaultFlag = value ? 1 : 0),
})

const form = ref<FormInstance>()
const onSubMit = async () => {
  await form.value?.validate()
  const gender = +patient.value.idCard.slice(-2, -1) % 2
  if (gender !== patient.value.gender) {
    showConfirmDialog({
      title: '温馨提示',
      message: '性别与身份证号码不一致\n 您确定要提交吗？',
    })
  }
  patient.value.id
    ? await editPatient(patient.value)
    : await addPatient(patient.value)
  const res = await getPatientList()
  list.value = res.data
  showSuccessToast('添加成功')
  showRight.value = false
}

const delPatientHandle = async () => {
  await showConfirmDialog({
    title: '温馨提示',
    message: `你确定要删除 ${patient.value.name} 的信息吗？`,
  })
  await delPatient(patient.value.id as string)
  showRight.value = false
  const res = await getPatientList()
  list.value = res.data
  showSuccessToast('删除成功')
}

const route = useRoute()
const isChange = computed(() => route.query.isChange === '1')

// 选中患者
const patientId = ref()
const selectedPatient = (item: PatientType) => {
  if (isChange.value) {
    patientId.value = item.id
  }
}
const router = useRouter()
const next = () => {
  if (!patientId.value) return showToast('请选择患者')
  store.setPatientId(patientId.value)
  router.push('/consult/pay')
}
</script>

<style lang="scss" scoped>
.patient-change {
  padding: 15px;
  > h3 {
    font-weight: normal;
    margin-bottom: 5px;
  }
  > p {
    color: var(--cp-text3);
  }
}
.patient-next {
  padding: 15px;
  background-color: #fff;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 80px;
  box-sizing: border-box;
}

.patient-page {
  padding: 46px 0 80px;
  :deep() {
    .van-popup {
      width: 100%;
      height: 100%;
      padding-top: 46px;
    }
    .van-action-bar {
      padding: 0 10px;
      margin-bottom: 10px;
      .van-button {
        color: var(--cp-price);
        background-color: var(--cp-bg);
      }
    }
  }
}
// 底部操作栏

.patient-list {
  padding: 15px;
}
.patient-item {
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: var(--cp-bg);
  border-radius: 8px;
  margin-bottom: 15px;
  position: relative;
  border: 1px solid var(--cp-bg);
  transition: all 0.3s;
  overflow: hidden;
  .info {
    display: flex;
    flex-wrap: wrap;
    flex: 1;
    span {
      color: var(--cp-tip);
      margin-right: 20px;
      line-height: 30px;
      &.name {
        font-size: 16px;
        color: var(--cp-text1);
        width: 80px;
        margin-right: 0;
      }
      &.id {
        color: var(--cp-text2);
        width: 180px;
      }
    }
  }
  .icon {
    color: var(--cp-tag);
    width: 20px;
    text-align: center;
  }
  .tag {
    position: absolute;
    right: 60px;
    top: 21px;
    width: 30px;
    height: 16px;
    font-size: 10px;
    color: #fff;
    background-color: var(--cp-primary);
    border-radius: 2px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &.selected {
    border-color: var(--cp-primary);
    background-color: var(--cp-plain);
    .icon {
      color: var(--cp-primary);
    }
  }
}
.patient-add {
  background-color: var(--cp-bg);
  color: var(--cp-primary);
  text-align: center;
  padding: 15px 0;
  border-radius: 8px;
  .cp-icon {
    font-size: 24px;
  }
}
.patient-tip {
  color: var(--cp-tag);
  padding: 12px 0;
  text-align: center;
}
.pb4 {
  padding-bottom: 4px;
}
</style>
