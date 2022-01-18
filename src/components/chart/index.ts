import * as echarts from 'echarts/core'
import {SVGRenderer} from 'echarts/renderers'
import {PieChart, BarChart, LineChart} from 'echarts/charts'
import {
  GridComponent,
  TitleComponent,
  LegendComponent,
  ToolboxComponent,
  TooltipComponent,
  DataZoomComponent,
  VisualMapComponent
} from 'echarts/components'

echarts.use([
  PieChart,
  BarChart,
  LineChart,
  SVGRenderer,
  GridComponent,
  TitleComponent,
  LegendComponent,
  ToolboxComponent,
  TooltipComponent,
  DataZoomComponent,
  VisualMapComponent
])

export default echarts