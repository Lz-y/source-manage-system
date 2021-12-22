<!-- <template>
  <el-table-column v-if="item._children" v-bind='item'>
    <template v-for="child in item._children">
      <columns v-if="child._children" :item='child'/>
      <el-table-column v-else v-bind='child'>
        <template v-if="child._slot" v-slot='scope'>
          <slot :name='child.prop' :data='scope'></slot>
        </template>
      </el-table-column>
    </template>
    <template v-if="item._slot" v-slot='scope'>
      <slot :name='item.prop' :data='scope'></slot>
    </template>
  </el-table-column>
  <el-table-column v-else v-bind='item'>
    <template v-if="item._slot" v-slot='scope'>
      <slot :name='item.prop' :data='scope'></slot>
    </template>
  </el-table-column>
</template> -->

<script lang="ts">
import { 
  defineComponent, 
  PropType,
  h,
  inject,
  ComponentInternalInstance,
  VNode,
  ref
} from "vue-demi"
import { ElTableColumn } from "element-plus"

export default defineComponent({
  props: {
    item: {
      type: Object as PropType<ColumnProps>,
      required: true,
      default: () => ({})
    } 
  },
  setup (props) {
    const root = inject<ComponentInternalInstance>('RootTable')
    const level = ref<number>(1)
    function createCols (col: ColumnProps, level: number) : VNode {
      return h(
        ElTableColumn,
        {
          ...col.attrs
        },
        col._slot ? { default: root!.slots[col.attrs.prop!]! } :
        (col._children && level <= (root?.props.maxLevel as number)) ? 
        col._children.map(_ => createCols(_, ++level)) : ''
      )
    }

    return () => {
      return createCols(props.item, level.value)
    }
  }
})
</script>