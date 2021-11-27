import 'vue-router'

declare module 'vue-router' {
  export type RouterType = {
    path?: string
    name?: string
    noShowingChildren?: boolean
    children?: RouterType[]
    hidden?: boolean
    meta?: RouteMeta
    showTooltip?: boolean
  }

  interface RouteMeta {
    title: string
    icon?: string
    isAdmin?: boolean
    auth?: boolean
  }
}