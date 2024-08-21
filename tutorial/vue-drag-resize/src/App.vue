<template>
  <div id="app">
    <h1>照片编辑器</h1>
    <div class="controls">
      <!-- 文件输入控件，用于选择图像文件 -->
      <input type="file" accept="image/*" @change="onFileChange" />
      <!-- 裁剪按钮，当没有选择图像时禁用 -->
      <button @click="onCropHandle" :disabled="!imageUrl">裁剪</button>
    </div>
    <!-- 当有图像被选择时显示编辑器容器 -->
    <div class="editor-container" v-if="imageUrl">
      <div class="image-container">
        <!-- 显示用户选择的图像 -->
        <img :src="imageUrl" class="photo" alt="用户选择的图像" />
        <!-- 裁剪区域 -->
        <vue-drag-resize
          :key="imageUrl"
          v-model="cropArea"
          class="crop-area"
          :resizable="true"
          :draggable="true"
          :min-width="50"
          :min-height="50"
          :parent="true"
          :parent-limitation="true"
          @resizing="onResizing"
          @dragging="onDragging"
        />
      </div>
    </div>
    <!-- 当有裁剪后的图像时显示预览容器 -->
    <div class="preview" v-if="croppedImageUrl">
      <h2>裁剪后的图片</h2>
      <!-- 显示裁剪后的图像 -->
      <img :src="croppedImageUrl" alt="裁剪后的图像" />
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import VueDragResize from 'vue-drag-resize/src'
const imageUrl = ref(null) // 存储图像的 URL

const photoRef = ref(null) // 图像的引用

const croppedImageUrl = ref(null) // 存储裁剪后的图像的 URL

// 裁剪区域的一些信息：坐标和尺寸
const cropArea = ref({
  x: 100,
  y: 100,
  w: 200,
  h: 100
})

// 用户改变裁剪区域尺寸的时候触发
const onResizing = ({ left, top, width, height }) => {
  cropArea.value = { x: left, y: top, w: width, h: height }
}
// 用户拖动裁剪区域的时候触发
const onDragging = ({ left, top }) => {
  cropArea.value = { ...cropArea.value, x: left, y: top }
}

// 处理文件选择的事件处理方法
const onFileChange = async (event) => {
  // 首先获取用户上传的文件
  const file = event.target.files[0]
  // 如果有文件，并且文件类型是图像类型
  if (file && file.type.startsWith('image/')) {
    // 里面主要是要将图片显示出来，这里通过 FileReader 来实现
    const reader = new FileReader() // 创建一个 FileReader 实例对象，用于读取文件
    // 当文件读取完成后就会触发 onload 事件
    reader.onload = async (e) => {
      imageUrl.value = e.target.result // 读取的文件内容，就是图像的 base64 编码
      await nextTick() // 等待下一次 DOM 更新，因为需要确保图像已经显示出来
      photoRef.value = document.querySelector('.photo') // 获取图像元素
    }
    reader.readAsDataURL(file) // 读取文件，读取完成后会触发 onload 事件
  }
}

// 处理裁剪的事件处理方法
const onCropHandle = () => {
  const photo = photoRef.value // 获取图像元素
  console.log(photo, 'photo')
  if (!photo) return
  // 创建一个新的 image 对象，用于存储裁剪后的图像
  const image = new Image()
  image.src = imageUrl.value // 设置图像的 URL
  // 该事件会在图像加载完成后触发
  image.onload = () => {
    // 主要需要做的工作，是将裁剪后的图像绘制到 canvas 上
    const canvas = document.createElement('canvas') // 创建一个 canvas 元素
    const ctx = canvas.getContext('2d') // 获取 canvas 的 2d 上下文对象
    // 从裁剪区域获取信息：坐标和尺寸
    const { x, y, w, h } = cropArea.value
    // 获取原始图像的尺寸
    const imageWidth = image.width
    const imageHeight = image.height
    // 获取显示图像的容器元素
    const containerWidth = photo.clientWidth
    const containerHeight = photo.clientHeight
    // 接下来来计算两个宽高比
    // 图像的宽高比
    const imageAspectRatio = imageWidth / imageHeight
    // 容器元素的宽高比
    const containerAspectRatio = containerWidth / containerHeight
    // 计算图像在容器中显示的宽高
    let displayWidth, displayHeight
    if (imageAspectRatio > containerAspectRatio) {
      // 图像更宽
      displayWidth = containerWidth
      displayHeight = containerWidth / imageAspectRatio
    } else {
      // 图像更高
      displayHeight = containerHeight
      displayWidth = containerHeight * imageAspectRatio
    }

    // 接下来需要计算图像在容器中的一个偏移量
    const offsetX = (containerWidth - displayWidth) / 2
    const offsetY = (containerHeight - displayHeight) / 2

    // 接下来还需要计算水平和垂直缩放比例
    const scaleX = imageWidth / displayWidth
    const scaleY = imageHeight / displayHeight

    // 为什么需要这些数据呢？因为一会儿绘制canvas的时候，需要使用这些数据

    // 设置 canvas 画布的宽高
    canvas.width = w * scaleX
    canvas.height = h * scaleY

    // 数据准备完毕后，接下来调用 canvas 方法来进行绘制
    ctx.drawImage(
      image, // 绘制的图像
      (x - offsetX) * scaleX, // 裁剪区域的 x 坐标
      (y - offsetY) * scaleY, // 裁剪区域的 y 坐标
      w * scaleX, // 裁剪区域的宽度
      h * scaleY, // 裁剪区域的高度
      0, // 绘制到 canvas 的 x 坐标
      0, // 绘制到 canvas 的 y 坐标
      w * scaleX, // 绘制到 canvas 的宽度
      h * scaleY // 绘制到 canvas 的高度
    )
    croppedImageUrl.value = canvas.toDataURL('image/png') // 将 canvas 转换为 base64 编码的 URL
  }
}
</script>

<style scoped>
#app {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.controls {
  margin-bottom: 20px;
}

.editor-container {
  width: 80%;
  height: 60vh;
  background-color: #fff;
  border: 1px solid #ccc;
  position: relative;
  overflow: hidden;
}

.image-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.photo {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.crop-area {
  border: 2px dashed #fff;
  background-color: rgba(133, 130, 130, 0.3);
}

.preview {
  margin-top: 20px;
  text-align: center;
}

.preview img {
  max-width: 100%;
  height: auto;
}
</style>
