<template>
  <form @submit.prevent="submitForm" class="form-container">
    <div class="form-group">
      <label for="username">用户名</label>
      <input v-model="state.username" id="username" class="form-control" />
      <span v-if="v$.username.$error" class="error-message">
        <span v-for="error in v$.username.$errors" :key="error.$uid">{{ error.$message }}</span>
      </span>
    </div>

    <div class="form-group">
      <label for="email">电子邮件</label>
      <input v-model="state.email" id="email" class="form-control" />
      <span v-if="v$.email.$error" class="error-message">
        <span v-for="error in v$.email.$errors" :key="error.$uid">{{ error.$message }}</span>
      </span>
    </div>

    <div class="form-group">
      <label for="password">密码</label>
      <input type="password" v-model="state.password" id="password" class="form-control" />
      <span v-if="v$.password.$error" class="error-message">
        <span v-for="error in v$.password.$errors" :key="error.$uid">{{ error.$message }}</span>
      </span>
    </div>

    <div class="form-group">
      <label for="confirmPassword">确认密码</label>
      <input
        type="password"
        v-model="state.confirmPassword"
        id="confirmPassword"
        class="form-control"
      />
      <span v-if="v$.confirmPassword.$error" class="error-message">
        <span v-for="error in v$.confirmPassword.$errors" :key="error.$uid">{{
          error.$message
        }}</span>
      </span>
    </div>

    <div class="form-group">
      <label for="phoneNumber">电话号码</label>
      <input v-model="state.phoneNumber" id="phoneNumber" class="form-control" />
      <span v-if="v$.phoneNumber.$error" class="error-message">
        <span v-for="error in v$.phoneNumber.$errors" :key="error.$uid">{{ error.$message }}</span>
      </span>
    </div>

    <div class="form-group">
      <label for="age">年龄</label>
      <input v-model="state.age" id="age" class="form-control" type="number" />
      <span v-if="v$.age.$error" class="error-message">
        <span v-for="error in v$.age.$errors" :key="error.$uid">{{ error.$message }}</span>
      </span>
    </div>

    <div class="form-group">
      <label for="website">网站</label>
      <input v-model="state.website" id="website" class="form-control" />
      <span v-if="v$.website.$error" class="error-message">
        <span v-for="error in v$.website.$errors" :key="error.$uid">{{ error.$message }}</span>
      </span>
    </div>

    <button type="submit" class="submit-button">注册</button>
  </form>
</template>

<script setup>
import { reactive, toRefs } from 'vue'
import {
  required,
  minLength,
  maxLength,
  email,
  sameAs,
  numeric,
  minValue,
  maxValue,
  url,
  helpers
} from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'

// 创建一个响应式状态对象，用于存储表单数据
const state = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  phoneNumber: '',
  age: '',
  website: ''
})

// 通过 helpers 函数创建验证规则
// 通过 helpers.withMessage 来自定义错误消息
// 前面是自定义错误消息，后面是用到的内置的验证规则
const requiredWithMessage = helpers.withMessage('该字段是必填的', required)
const minLengthWithMessage = (min) => helpers.withMessage(`至少需要${min}个字符`, minLength(min))
const maxLengthWithMessage = (max) => helpers.withMessage(`最多只能有${max}个字符`, maxLength(max))
const emailWithMessage = helpers.withMessage('请输入有效的电子邮件地址', email)
const someAsPasswordWithMessage = (password) =>
  helpers.withMessage('两次输入的密码不一致', sameAs(password))
const numericWithMessage = helpers.withMessage('必须是一个有效的数字', numeric)
const minValueWithMessage = (min) => helpers.withMessage(`必须大于或等于${min}`, minValue(min))
const maxValueWithMessage = (max) => helpers.withMessage(`必须小于或等于${max}`, maxValue(max))
const urlWithMessage = helpers.withMessage('必须是一个有效的 URL', url)
const phoneNumberWithMessage = helpers.withMessage(
  '必须是一个有效的电话号码',
  helpers.regex(/^1[3-9]\d{9}$/)
)

const { password } = toRefs(state)

// 定义验证规则
const rules = {
  // 针对一个字段设置了多个验证规则
  username: {
    required: requiredWithMessage,
    minLength: minLengthWithMessage(3),
    maxLength: maxLengthWithMessage(20)
  },
  email: {
    required: requiredWithMessage,
    email: emailWithMessage
  },
  password: {
    required: requiredWithMessage,
    minLength: minLengthWithMessage(8)
  },
  confirmPassword: {
    required: requiredWithMessage,
    sameAsPassword: someAsPasswordWithMessage(password)
  },
  phoneNumber: {
    required: requiredWithMessage,
    numeric: numericWithMessage,
    phoneNumber: phoneNumberWithMessage
    // minLength: minLengthWithMessage(10),
    // maxLength: maxLengthWithMessage(15)
  },
  age: {
    required: requiredWithMessage,
    numeric: numericWithMessage,
    minValue: minValueWithMessage(18),
    maxValue: maxValueWithMessage(120)
  },
  website: {
    required: requiredWithMessage,
    url: urlWithMessage
  }
}

// 创建一个验证实例对象
const v$ = useVuelidate(rules, state)

// 提交表单
const submitForm = () => {
  // 1. 触发验证
  v$.value.$touch()
  if (v$.value.$invalid) {
    console.log('表单验证失败')
  } else {
    console.log('表单验证成功')
  }
}
</script>

<style scoped>
.form-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-control {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
}

.error-message {
  color: #ff4d4f;
  font-size: 14px;
  margin-top: 5px;
  display: block;
}

.submit-button {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #0056b3;
}
</style>
