declare interface AnyTypeObject {
  [k: string]: any
}
// query form config props
declare interface QConfig {
  name: 'input' | 'select' | 'date-picker' | 'checkbox' | 'radio' | 'switch' | 'rate'
  prop: string
  label: string
  options?: any[]
  group?: boolean
  type?: 'button'
  events?: {
    [k: string]: any
  }
  attrs?: {
    [k: string]: any
  }
}
// table column config props
declare interface ColumnProps {
  attrs: {
    type?: string
    prop?: string
    label?: string
  }
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