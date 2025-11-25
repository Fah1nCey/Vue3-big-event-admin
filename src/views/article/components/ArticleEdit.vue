<script setup>
import { ref } from 'vue'
import ChannelSelect from './ChannelSelect.vue'
import { Plus } from '@element-plus/icons-vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import {
  artPublishService,
  artGetDetailService,
  artEditService
} from '@/api/article'
import { baseURL } from '@/utils/request'
import axios from 'axios'

const visibleDrawer = ref(false)
const emit = defineEmits(['success'])
const editorRef = ref()
// 默认空数据
const defaultForm = {
  title: '', // 标题
  cate_id: '', // 分类id
  // categoryId: '', // 自制版后端参数
  content: '', // string内容
  cover_img: '', // 封面图片 file对象
  state: '' // 状态
}

const formModel = ref({ ...defaultForm })

const open = async (raw) => {
  visibleDrawer.value = true
  if (raw.id) {
    // 因为raw中不存在content和cover_img属性信息
    // 所以需要基于raw.id发送请求，获取编辑对应的文章详情信息，进行回显
    // 回显文章详情内容
    const res = await artGetDetailService(raw.id)
    formModel.value = res.data.data
    imgUrl.value = baseURL + formModel.value.cover_img
    // 提交给后台，需要的是 file 格式的，将网络图片，转成 file 格式
    // 网络图片转成 file 对象, 需要转换一下
    formModel.value.cover_img = await imageUrlToFile(
      imgUrl.value,
      formModel.value.cover_img
    )
  } else {
    // 重置表单信息
    formModel.value = { ...defaultForm }
    imgUrl.value = ''
    editorRef.value.setHTML('')
  }
  //  扩展运算符 ... 会把 defaultForm 的所有属性（包括 id）都浅拷贝到 formModel.value 中
  // 浅拷贝：{ ...defaultForm } 是 浅拷贝（创建一个新对象，复制 defaultForm 的属性），
  // 此时 formModel.value 和 defaultForm 是两个独立的对象
  // JavaScript 对象支持动态添加属性
  // console.log(defaultForm)
  // console.log(formModel.value)
}

defineExpose({
  open
})

// 上传封面
const imgUrl = ref('')
const onUploadFile = (uploadFile) => {
  // 生成预览图片
  imgUrl.value = URL.createObjectURL(uploadFile.raw)
  // 保存原始File对象到数据模型中
  formModel.value.cover_img = uploadFile.raw
}

// 将网络图片地址转换为File对象
async function imageUrlToFile(url, fileName) {
  try {
    // 第一步：使用axios获取网络图片数据
    const response = await axios.get(url, { responseType: 'arraybuffer' })
    const imageData = response.data

    // 第二步：将图片数据转换为Blob对象
    const blob = new Blob([imageData], {
      type: response.headers['content-type']
    })

    // 第三步：创建一个新的File对象
    const file = new File([blob], fileName, { type: blob.type })

    return file
  } catch (error) {
    console.error('将图片转换为File对象时发生错误:', error)
    throw error
  }
}

// 发布&草稿文章、编辑文章
const onPublish = async (state) => {
  formModel.value.state = state
  // 注意： 当前接口，需要的是formData 对象
  // 将对象 => 转换成 => formData对象
  const fd = new FormData()
  for (let key in formModel.value) {
    fd.append(key, formModel.value[key])
  }
  if (formModel.value.id) {
    // 编辑文章
    await artEditService(fd)
    ElMessage.success('编辑成功')
    visibleDrawer.value = false
    emit('success', 'edit')
  } else {
    await artPublishService(fd)
    ElMessage.success('发布成功')
    visibleDrawer.value = false
    emit('success', 'add')
  }
}
</script>

<template>
  <el-drawer
    v-model="visibleDrawer"
    :title="formModel.id ? '编辑文章' : '添加文章'"
    direction="rtl"
    size="50%"
  >
    <!-- 发表文章表单 -->
    <el-form :model="formModel" ref="formRef" label-width="100px">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="formModel.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="文章分类" prop="cate_id">
        <channel-select
          v-model="formModel.cate_id"
          width="100%"
        ></channel-select>
      </el-form-item>
      <el-form-item label="文章封面" prop="cover_img">
        <el-upload
          class="avatar-uploader"
          :auto-upload="false"
          :show-file-list="false"
          :on-change="onUploadFile"
        >
          <img v-if="imgUrl" :src="imgUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="文章内容" prop="content">
        <div class="editor">
          <QuillEditor
            ref="editorRef"
            v-model:content="formModel.content"
            theme="snow"
            contentType="html"
          ></QuillEditor>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onPublish('已发布')">发布</el-button>
        <el-button type="info" @click="onPublish('草稿')">草稿</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }
    .el-upload:hover {
      border-color: var(--el-color-primary);
    }
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}

.editor {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>
