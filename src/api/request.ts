import axios, {AxiosRequestConfig} from "axios"
import {ElMessage, ElMessageBox} from 'element-plus'
import {ResponseData} from '#/global'

const serve = axios.create({
  baseURL: import.meta.env.BASE_URL,
  timeout: 10000,
})

// request interceptor
serve.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    if (!config.headers!['token']) {
      config.headers!['token'] = `Bearn ${localStorage.getItem('token')!}`
    }
    return config
  },
  error => {
    console.error('request error -->', error)
    ElMessage({
      type: 'error',
      message: error,
      duration: 2000
    })
  }
)

// response interceptor
serve.interceptors.response.use(
  async response => {
    const {code, msg, result} = response.data as ResponseData
    // error code handle
    switch (code) {
      case 401:
      case 403:
        await ElMessageBox.confirm('请先登录', )
        break
      case 1000:// psd or account invaild
        ElMessage({
          type: 'warning',
          message: msg,
          duration: 2000
        })
        break
     default:
      break
    }
    return response.data
  },
  error => {
    console.error('response error -->', error)
    ElMessage({
      type: 'error',
      message: error,
      duration: 2000
    })
  }
)

export default serve