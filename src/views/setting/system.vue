<template>
  <div class="system-setting-page">
    系统设置
    <input type="file" @change="handleFileChange" />
    <el-button type="primary" @click="handleUpload" size="small">上传文件</el-button>
    <h2>总进度：{{ totalPercentage }} %</h2>
    <div class="percentage total">
      <p class="bg" :style="`width:${totalPercentage || 0}%`"></p>
    </div>

    <div class="progress" v-if="chunksList.length">
      <div class="progress-chunk" v-for="(item, index) in chunksList">
        <div class="clonm flex-1">{{ item.name }}_{{ index }}</div>
        <div class="clonm size">{{ item.size }} kb</div>
        <div class="clonm flex-1">
          <div class="percentage">
            <p class="bg" :style="`width:${item.percentage || 0}%`"></p>
          </div>
          <span class="text">{{ item.percentage || 0 }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'SystemSetting'
}
</script>
<script setup lang="ts">
import {ref, computed} from 'vue'
import {uploadFile, mergeChunks} from '@/api'

const selectFile = ref<File | null>(null)
const chunksList = ref<any[]>([])

function handleFileChange (e: any) {
  const file = e.target.files[0] as File
  if (!file) {
    return
  }

  selectFile.value = file
  chunksList.value = []
}
const chunkSize = 1 * 1024 * 1024// 每个切片的大小
const chunksCount = 20// 最大 chunk 数量
const totalPercentage = computed(() => {
  if (!chunksList.value.length) {
    return 0
  }
  const loaded = chunksList.value.map(item => item.size * item.percentage)
        .reduce((cur, next)=> cur + next)
  return parseInt((loaded / selectFile.value!.size).toFixed(2))
})

function createChunks (file: File, size: number) {
  const fileChunks = [];
  let cur = 0;
  while(cur < file.size) {
    const chunk = file.slice(cur, cur + size)
    fileChunks.push({chunk: chunk, size: chunk.size})
    cur += size
  }
  return fileChunks
}

async function uploadChunks(chunks: Array<any>) {
  const requestList = chunks.map((item, index) => {
    const formData = new FormData()
    formData.append(`${item.hash}`, item.chunk)
    formData.append('hash', item.hash)
    formData.append('filename', selectFile.value?.name!)
    return {formData, index}
    // return uploadFile(formData, onUploadProgress(item))
  })
  await sendRequest(requestList, 1)
  // await Promise.all(requestList)
}

function onUploadProgress (item: any) {
  return (e: any) => {
    item.percentage = parseInt(String((e.loaded / e.total) * 100))
  }
}

async function handleUpload () {
  const fileChunks = createChunks(selectFile.value!, chunkSize)
  chunksList.value = fileChunks.map(({chunk, size}, index) => ({
    chunk,
    size,
    name: selectFile.value?.name,
    hash: `${selectFile.value?.name}-${index}`
  }))
  
  await uploadChunks(chunksList.value)
  await mergeRequest()
}

async function mergeRequest() {
  await mergeChunks({filename: selectFile.value?.name, size: chunkSize})
}

function sendRequest (list: any[], max: number) {
  return new Promise((resolve, reject) => {
    let count = 0, idx = 0;
    const len = list.length

    const start = async () => {
      while(idx < len && max > 0){
        const formData = list[idx].formData,
          index = list[idx].index
        max--
        idx++
        uploadFile(formData, onUploadProgress(chunksList.value[index]))
        .then(() => {
          setTimeout(() => {
            max++
            count++
            if (count === len) {
              resolve('ok')
            } else {
              start()
            }
          }, 200)
        })
      }
    }
    start()
  })
}

</script>

<style>
h2 {
  margin: 20px;
  width: 90%;
}
.total {
  width: 91%;
  margin: auto;
}
.progress {
  width: 90%;
  margin: 20px auto;
  border: 1px solid #0677e9;
  padding: 10px;
}
.progress-chunk {
  display: flex;
  padding: 10px 0;
  border-bottom: 1px solid #c5d1dd;
}
.clonm {
  display: flex;
  align-items: center;
  word-break: break-word;
  text-align: center;
}
.size {
  width: 200px;
}
.flex-1 {
  flex: 1;
}
.percentage {
  flex: 1;
  background-color: #bdc1c5;
  border-radius: 3px;
  height: 6px;
  display: flex;
  align-items: center;
}
.bg {
  height: 100%;
  width: 0%;
  border-radius: 3px;
  background: rgb(22, 245, 2);
}
.text {
  width: 45px;
  padding: 0 5px;
}
</style>