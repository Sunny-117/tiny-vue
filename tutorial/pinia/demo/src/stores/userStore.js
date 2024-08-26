import { defineStore } from 'pinia'
import axios from 'axios'

const API_URL = 'http://localhost:3000/users'

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [], // 存放用户数据
    loading: false, // 是否加载中
    error: null // 错误信息
  }),
  actions: {
    // 获取用户列表
    async fetchUsers() {
      this.loading = true
      this.error = null
      try {
        const response = await axios.get(API_URL)
        this.users = response.data
        return response.data // 作为 after 回调函数的参数
      } catch (error) {
        this.error = error.message
        return error // 作为 after 回调函数的参数
      } finally {
        this.loading = false
      }
    },
    // 添加用户
    async addUser(user) {
      try {
        // 更新后端数据
        const response = await axios.post(API_URL, user)
        // 更新本地数据仓库的数据
        this.users.push(response.data)
        return response.data // 作为 after 回调函数的参数
      } catch (error) {
        this.error = error.message
      }
    },
    // 删除用户
    async removeUser(userId) {
      try {
        await axios.delete(`${API_URL}/${userId}`)
        this.users = this.users.filter((user) => user.id !== userId)
        return userId // 作为 after 回调函数的参数
      } catch (error) {
        this.error = error.message
      }
    }
  },
  persist: {
    storage: localStorage
  }
})
