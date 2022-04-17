declare interface AnyTypeObject {
  [k: string]: any
}
// query form config props
declare interface QConfig {
  name: 'input' | 'input-number' | 'select' | 'date-picker' | 'checkbox' | 'radio' | 'switch' | 'rate'
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
declare interface ResponseData {
  code: number
  msg: string
  result: any
}
declare interface User {
  _id?: string
  account: string
  nickName: string
  gender: 0 | 1 | null
  email: string
  avatar?: string
  status: 0 | 1
  createTime?: string
}

declare interface Article {
  _id?: any
  url?: string
  title: string
  classify: string
  tags: Array<string>
  createTime: string
  publishTime: string
  viewNum: number
  commentNum: number
  likeNum: number
  encrypt: 0 | 1
  status: 0 | 1
  psw?: string
  content: string
}

declare interface ResourceFile {
  _id?: string
  name: string
  img?: string
  link: string
  classify: string
  summary: string
  status: 0 | 1
  encrypt: 0 | 1
  psw?: string
  createTime: string
}

declare interface Message {
  _id?: string
  title: string
  content: string
  time: string
  replyStatus: 0 | 1
  reply?: string
  status: 0 | 1
  createTime: string
}

declare interface Logs {
  _id?: string
  userAgent: string
  ip: string
  url: string
  time: string
  code: 200 | 301 | 302 | 304 | 401 | 403 | 404 | 500 | 502
  status: 0 | 1
  requestTime: string
}

declare interface Project{
  _id?: string
  name: string
  img?: string
  description: string
  createTime: string
  runingTime: string
  runing: 0 | 1
}

declare interface Dictionary {
  _id?: any
  name: string
  type: string,
  children?: Array<Dictionary>
  createTime: string
}

declare interface Todo {
  name: string
  finished: boolean
}
declare interface Schedule {
  _id?: string
  name: string
  spend: string[]
  summary: string
  status: 0 | 1 | 2 | null
  sequence: number
  createTime?: string
}