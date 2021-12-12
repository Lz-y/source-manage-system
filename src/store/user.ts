import { defineStore } from "pinia"
import { reactive } from "vue-demi"

export interface UserState {
  account: string
  name: string
  age: number
  email: string
  avatar: string
  permissions: Array<string>
  token: string | null
}

export default defineStore('user', () => {
  
  const user = reactive<Partial<UserState>>({})

  function changeUserInfo (userInfo: UserState) {
    Object.assign(user, userInfo)
  }

  function logout () {
    user.token = null
  }
  return {
    user,
    changeUserInfo,
    logout
  }
})