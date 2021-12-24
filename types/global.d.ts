declare interface AnyTypeObject {
  [k: string]: any
}
// query form config props
declare interface QConfig {
  name: 'input' | 'select' | 'date-picker' | 'checkbox' | 'radio' | 'switch' | 'rate'
  prop: string
  label?: string
  options?: any[]
  group?: boolean
  type?: 'button'
  events?: AnyTypeObject
  attrs?: AnyTypeObject
}
// table column config props
declare interface ColumnProps {
  attrs: {
    type?: string
    prop?: string
    label?: string
  } & AnyTypeObject
  _children?: Array<ColumnProps>
  _slot?: boolean
}
// tab component config props
declare interface TabsProps{
  name: string
  label: string
  component: any
  show: boolean
}

declare interface User {
  account: string
  nickName: string
  email: string
  avatar?: string
  status: 0 | 1
}

declare interface Article {
  url?: ''
  title: ''
  classify: Array<string>
  createTime: string
  pv: number
  commentary: number
  encrypt: 0 | 1
  status: 0 | 1
}

declare interface ResourceFile { 
  name: string
  img?: string
  url: string
  description: string
  status: 0 | 1
  encrypt: 0 | 1
  psw?: string
}

declare interface Message {
  title: string
  message: string
  time: string
  isReply: 0 | 1
  reply?: string
  status: 0 | 1
}

declare interface Logs {
  agent: string
  ip: string
  url: string
  time: string
  status: number
}