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
    type?: 'index' | 'selection' | 'expand'
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
  url?: string
  title: string
  classify: string
  tags: Array<string>
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
  classify: string
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
  code: 200 | 301 | 302 | 304 | 401 | 403 | 404 | 500 | 502
  status: 0 | 1
}

declare interface Project{
  name: string
  img?: string
  description: string
  createTime: string
  runingTime: string
  runing: 0 | 1
}

declare interface Dictionary {
  name: string
  type: string,
  children?: Array<Dictionary>
}

declare interface Todo {
  name: string
  finished: boolean
}
declare interface Schedule {
  name: string
  date: Date
  description: string
  finished: 0 | 1 | 2
}