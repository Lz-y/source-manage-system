import { defineStore } from 'pinia'
import { reactive } from 'vue-demi'
 
export interface DeviceOptions {
  device: string
  version: string
  screenWidth: number
  screenHeight: number
  theme: string
  fontSize: number
}
export interface AppState {
  deviceDisplay: Partial<DeviceOptions>
  expended: boolean
}

export default defineStore('app', () => {

  const app = reactive<Partial<AppState>>({
    deviceDisplay: {},
    expended: false
  })

  function toggleExpend (status: boolean): void {
    app.expended = status
  }
  

  function changeDeviceInfo (deviceInfo: Partial<DeviceOptions>): void {
    Object.assign(app.deviceDisplay, deviceInfo)
  }

  return {
    app,
    toggleExpend,
    changeDeviceInfo
  }
})