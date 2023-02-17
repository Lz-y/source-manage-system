<template>
  <div class="login">
    <div class="login-bg">
      <img src="@/assets/login.svg" class="login-bg-icon" />
    </div>
    <div class="login-content">
      <div class="login-content-main">
        <h4 class="login-content-title">登录</h4>
        <el-form
          :model="loginForm"
          :rules="rules"
          ref="loginFormRef"
          size="large"
          class="login-content-form"
        >
          <el-form-item prop="account">
            <el-input
              type="text"
              placeholder="请输入账号"
              v-model="loginForm.account"
              clearable
              autocomplete="off"
            >
              <template #prefix>
                <el-icon><User /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="psw">
            <el-input
              :type="isShowPassword ? 'text' : 'password'"
              placeholder="请输入密码"
              v-model="loginForm.psw"
              autocomplete="off"
            >
              <template #prefix>
                <el-icon><Unlock /></el-icon>
              </template>
              <template #suffix>
                <el-icon
                  class="login-content-password"
                  @click="isShowPassword = !isShowPassword"
                >
                  <View v-if="isShowPassword" />
                  <Hide v-else />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              class="login-content-submit"
              round
              @click="onSignIn"
              :loading="loading"
            >
              <span>登录</span>
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, toRefs, reactive, defineComponent, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Unlock, User, Position, View, Hide } from '@element-plus/icons-vue'
import { ElMessage, ElForm } from 'element-plus'
import { login } from '@/api'
export default defineComponent({
  name: 'Login',
  components: {
    Unlock,
    User,
    Position,
    View,
    Hide,
  },
  setup() {
    const state = reactive({
      isShowPassword: false,
      loginForm: {
        account: '',
        psw: '',
      },
      rules: {
        account: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        psw: [{ required: true, message: '请输入密码', trigger: 'blur' }],
      },
      loading: false,
    })
    const loginFormRef = ref<InstanceType<typeof ElForm> | null>(null)

    const router = useRouter()
    const route = useRoute()

    const onSignIn = async () => {
      if (!loginFormRef.value) {
        return
      }

      const isVaild = await loginFormRef.value.validate()

      if (!isVaild) {
        return
      }
      try {
        const user = await login(state.loginForm)
      } catch (error) {
        throw error
      } finally {
        state.loading = true
        signInSuccess()
      }
    }

    const signInSuccess = () => {
      state.loading = false
      // nextTick(() => {
      //   ElMessage.success({
      //     message: `欢迎回来`,
      //     duration: 2000,
      //   })
      // })
      if (route.query?.redirect) {
        router.push({
          path: route.query.redirect as string,
        })
      } else {
        router.push('/')
      }
    }
    return {
      ...toRefs(state),
      loginFormRef,
      onSignIn,
    }
  },
})
</script>
<style lang="scss">
.login {
  width: 100%;
  height: 100%;
  position: relative;
  background: var(--el-color-white);
  &-bg {
    width: 100%;
    height: 100%;
    position: relative;
    &::before {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 60%;
      overflow: hidden;
      height: 80%;
      -webkit-mask-box-image: url("data:image/svg+xml,%3Csvg width='1200' height='770' xmlns='http://www.w3.org/2000/svg' fill='none'%3E%3Cg%3E%3Cpath id='svg_1' d='M58.4 47.77C104.6 59.51 135.26 67.37 162.11 78.04C188.97 88.72 226.33 102.69 265.92 123.55C305.51 144.4 366.96 167.09 441.43 121.52C515.9 75.95 546.48 61.01 577.69 46.27C608.9 31.53 625.86 23.69 680.26 12.28C734.65 0.87 837.29 10.7 867.29 21.8C897.29 32.9 935.51 51.9 962.21 95.45C988.9 139.01 972.91 177.36 951.37 221.39C929.83 265.43 883.49 306 890.44 337.33C897.4 368.66 974.73 412.18 974.73 411.47C974.73 412.18 1066.36 457.62 1106.36 491.06C1146.36 524.5 1178.8 563.36 1184.03 579.63C1189.26 595.9 1200.4 622.49 1181.55 676.88C1162.71 731.26 1127.16 764.32 1115.31 778.64C1103.45 792.96 5.34 783.61 4.32 784.63C3.3 785.65 -172.34 2.38 1.13 35.04L58.4 47.77L58.4 47.77Z' fill='%23409eff'%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E");
      background: var(--el-color-primary-light-5);
      transition: all 0.3s ease;
    }
    &::after {
      content: '';
      width: 150px;
      height: 300px;
      position: absolute;
      right: 0;
      top: 0;
      -webkit-mask-box-image: url("data:image/svg+xml,%3Csvg width='150' height='300' xmlns='http://www.w3.org/2000/svg' fill='none'%3E%3Cg%3E%3Cpath id='svg_1' d='M-0.56 -0.28C41.94 36.17 67.73 18.94 93.33 33.96C118.93 48.98 107.58 73.56 101.94 89.76C96.29 105.96 50.09 217.83 47.87 231.18C45.64 244.52 46.02 255.2 64.4 270.05C82.79 284.91 121.99 292.31 111.98 289.81C101.97 287.32 153.96 301.48 151.83 299.9C149.69 298.32 149.98 -1.36 149.71 -1.18C149.98 -1.36 -43.06 -36.74 -0.56 -0.28L-0.56 -0.28Z' fill='%23409eff'%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E");
      background: var(--el-color-primary-light-5);
      transition: all 0.3s ease;
    }
    &-icon {
      width: 60%;
      height: 70%;
      position: absolute;
      left: 0;
      bottom: 0;
    }
  }
  &-content {
    width: 450px;
    padding: 20px;
    position: absolute;
    right: 200px;
    top: 50%;
    transform: translateY(-50%) translate3d(0, 0, 0);
    background-color: var(--el-color-white);
    box-shadow: 1px 1px 6px 4px var(--el-color-primary-light-9);
    border-radius: 5px;
    overflow: hidden;
    z-index: 1;
    height: 320px;
    &-main {
      margin: 0 auto;
      width: 80%;
    }
    &-title {
      color: var(--el-text-color-primary);
      font-weight: 500;
      font-size: 22px;
      text-align: center;
      letter-spacing: 4px;
      margin: 15px 0 30px;
      white-space: nowrap;
      z-index: 5;
      position: relative;
      transition: all 0.3s ease;
    }
    &-form {
      margin-top: 20px;
      .login-content-password {
        display: inline-block;
        width: 20px;
        cursor: pointer;
        &:hover {
          color: #909399;
        }
      }
      .login-content-submit {
        width: 100%;
        letter-spacing: 2px;
        font-weight: 300;
        margin-top: 15px;
      }
    }
  }
}
</style>
