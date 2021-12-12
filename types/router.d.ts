import 'vue-router'

declare module 'vue-router' {
  interface RouterType {
    path?: string
    noShowingChildren?: boolean
    children?: RouterType[]
    meta?: RouteMeta
    showTooltip?: boolean,
  }

  interface RouteMeta {
    title?: string
    icon?: string
    isAdmin?: boolean
    auth?: boolean
    hidden?: boolean
    breadcrumb?: boolean
  }
}