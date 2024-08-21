<template>
  <Line :data="data" :options="options" />
</template>

<script setup>
import { ref } from 'vue'
// 接下来需要从 chart.js 里面引入一些组件
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import { Line } from 'vue-chartjs'
// 引入第三方插件，然后也需要注册一下
import zoomPlugin from 'chartjs-plugin-zoom'

// 首先需要注册从 chart.js 引入的组件
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  CategoryScale,
  LinearScale,
  zoomPlugin
)

const data = ref({
  labels: ['January', 'February', 'March'],
  datasets: [
    {
      label: 'Dataset 1',
      backgroundColor: '#f87979',
      data: [40, 20, 12]
    }
  ]
})
const options = ref({
  responsive: true,
  plugins: {
    // 具体插件相关的配置，参阅这个插件的文档
    zoom: {
      zoom: {
        wheel: {
          enabled: true // 启用滚轮缩放
        },
        pinch: {
          enabled: true // 启用捏合缩放
        },
        mode: 'xy' // 允许沿X轴和Y轴缩放
      },
      pan: {
        enabled: true,
        mode: 'xy'
      }
    },
    title: {
      display: true,
      text: 'Line Chart with Zoom and Pan'
    },
    legend: {
      display: true,
      position: 'top'
    },
    tooltip: {
      enabled: true,
      mode: 'index',
      intersect: false
    }
  }
})
</script>
