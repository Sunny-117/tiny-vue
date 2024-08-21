<template>
  <Bar :data="data" :options="options" />
</template>

<script setup>
import { ref } from 'vue'
// 接下来需要从 chart.js 里面引入一些组件
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import { Bar } from 'vue-chartjs'

// 首先需要注册从 chart.js 引入的组件
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const data = ref({
  // 图表的X轴
  labels: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ],
  datasets: [
    {
      label: '月份销售数据',
      backgroundColor: '#f87979', // 数据集的背景颜色
      data: [40, 20, 12, 39, 10, 40, 39, 80, 40, 20, 12, 11] // 数据集的数据(Y轴)
    }
  ]
})

const options = ref({
  responsive: true // 响应式，图表会根据容器大小自动调整
})
</script>
