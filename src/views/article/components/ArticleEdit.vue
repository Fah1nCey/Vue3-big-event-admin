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
// import { baseURL } from '@/utils/request'
// import axios from 'axios'

const visibleDrawer = ref(false)
const emit = defineEmits(['success'])
const editorRef = ref()
// 默认空数据
const defaultForm = {
  title: '', // 标题
  categoryId: '', // 分类id
  content: '', // string内容
  coverImg: '', // 封面图片 file对象
  state: '' // 状态
}

const formModel = ref({ ...defaultForm })

const open = async (raw) => {
  visibleDrawer.value = true
  if (raw.id) {
    // 文章编辑
    // 因为raw中不存在content和cover_img属性信息
    // 所以需要基于raw.id发送请求，获取编辑对应的文章详情信息，进行回显
    // 回显文章详情内容
    const res = await artGetDetailService(raw.id)
    formModel.value = res.data.data
    // imgUrl.value = baseURL + formModel.value.coverImg
    // imgUrl 是用来做图片预览的，用完后将coverImg重新赋值为空字符串
    imgUrl.value = formModel.value.coverImg
    formModel.value.coverImg = ''
    // 伐伐备注：点击编辑文章时，会自动把封面图片转成 file 对象，但图片未更改，会导致重复上传同一张图片的问题
    // 解决方案：只有在用户更改封面图片时，才上传图片（有另外的方法，所以这个方法注释掉），后端接口设置成不必须上传封面图片
    // 提交给后台，需要的是 file 格式的，将网络图片，转成 file 格式
    // 网络图片转成 file 对象
    // formModel.value.coverImg = await imageUrlToFile(
    //   imgUrl.value,
    //   formModel.value.coverImg.substring(
    //     formModel.value.coverImg.lastIndexOf('/') + 1
    //   )
    // )
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
  formModel.value.coverImg = uploadFile.raw
}

// 发布&草稿文章、编辑文章
const onPublish = async (state) => {
  formModel.value.state = state
  // 富文本内容在数据库中存在标签，需要把标签去掉
  formModel.value.content = formModel.value.content.replace(
    /<\/?[^>]+(>|$)/g,
    ''
  )
  // 注意： 当前接口，需要的是formData 对象
  // 将对象 => 转换成 => formData对象
  const fd = new FormData()
  for (let key in formModel.value) {
    if (key === 'coverImg' && formModel.value.coverImg === '') {
      continue
    }
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
      <el-form-item label="文章分类" prop="categoryId">
        <channel-select
          v-model="formModel.categoryId"
          width="100%"
        ></channel-select>
      </el-form-item>
      <el-form-item label="文章封面" prop="coverImg">
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
