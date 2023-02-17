<template>
  <div class="home">
    <el-row :gutter="20">
      <el-col
        :xs="12"
        :sm="12"
        :lg="24 / statistical.length"
        v-for="item in statistical"
      >
        <div class="card-panel">
          <div class="card-panel-icon">
            <svg-icon :name="item.type.toLowerCase()" size="3"></svg-icon>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-txt">{{ item.type }}</div>
            <div class="card-panel-num">{{ item.num }}</div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :xl="16" :lg="16" :md="14" :sm="14" :xs="24">
        <el-card>
          <line-chart v-bind="message" />
        </el-card>
      </el-col>
      <el-col :xl="8" :lg="8" :md="10" :sm="10" :xs="24">
        <el-card>
          <pie-chart :data="articles" />
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <!-- <el-col :xl="18" :lg="18" :md="12" :sm="24" :xs="24">
        <el-card>
          <bar-chart />
        </el-card>
      </el-col> -->
      <el-col :xl="6" :lg="6" :md="12" :sm="24" :xs="24">
        <el-card :body-style="{ padding: '0px' }">
          <Todo :data="todos" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, onMounted, toRefs } from 'vue'
import LineChart from '@/components/chart/line.vue'
import PieChart from '@/components/chart/pie.vue'
// import BarChart from '@/components/chart/bar.vue'
import Todo from '@/components/todo/index.vue'
import { getStates } from '@/api'
// import { Message, Schedule, State } from '#/global'
export default defineComponent({
  inheritAttrs: false,
  name: 'Home',
  components: {
    LineChart,
    PieChart,
    // BarChart,
    Todo,
  },
  setup() {
    const state = reactive({
      message: {
        xaixs: [],
        replied: [],
        unreplied: [],
      },
      articles: [],
      todos: [],
    })

    const statistical = ref([
      { type: 'Schedule', num: 0 },
      { type: 'Article', num: 0 },
      { type: 'Resource', num: 0 },
      { type: 'Message', num: 0 },
    ])

    const getStatistic = async () => {
      try {
        const {
          result: { articles, todos, messages, resources },
        } = await getStates()
        state.articles = articles.data
        state.todos = todos.data
        state.message.xaixs = Array.from(
          new Set(messages.data.map((item: any) => item.date))
        )
        state.message.replied = messages.data.filter(
          (item: any) => item.status === 1
        )
        state.message.unreplied = messages.data.filter(
          (item: any) => item.status === 0
        )
        statistical.value[0].num = todos.total
        statistical.value[1].num = articles.total
        statistical.value[2].num = resources.total
        statistical.value[3].num = messages.total
      } catch (error) {
        throw error
      }
    }

    onMounted(() => {
      getStatistic()
    })

    return {
      ...toRefs(state),
      statistical,
    }
  },
})
</script>

<style lang="scss">
.home {
  .el-row {
    margin-bottom: 20px;
  }
  .card-panel {
    background: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 40px;
    border-radius: 10px;
    &-txt {
      line-height: 18px;
      color: rgba(0, 0, 0, 0.45);
      font-size: 16px;
      margin-bottom: 12px;
    }
    &-num {
      font-size: 20px;
      text-align: center;
    }
  }
}
</style>
