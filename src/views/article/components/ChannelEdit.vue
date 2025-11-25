<script setup>
import { ref } from 'vue'
import { artAddChannelService, artEditChannelService } from '@/api/article'
import { ElMessage } from 'element-plus'
// 添加文章分类弹层
const dialogVisible = ref(false)
const formModel = ref({
  cate_name: '',
  cate_alias: ''
})
const formRef = ref()

// 组件对外暴露一个方法open，基于open传来的参数，区分添加还是编辑
// open({}) => 表单无需渲染，说明是添加
// open({id, cate_name, ...}) => 表单需要渲染，说明是编辑
// open调用后，可以打开弹窗
const open = (raw) => {
  dialogVisible.value = true
  formModel.value = { ...raw } // 添加 => 重置了表单内容， 编辑 => 存储了需要回显的数据
}

// 向外暴露方法
defineExpose({
  open
})

const rules = {
  cate_name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    {
      pattern: /^\S{1,10}$/,
      message: '分类名必须是1-10位的非空字符',
      trigger: 'blur'
    }
  ],
  cate_alias: [
    { required: true, message: '请输入分类别名', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9]{1,15}$/,
      message: '分类别名必须是1-15位的字母数字',
      trigger: 'blur'
    }
  ]
}

// 定义一个事件success
const emit = defineEmits(['success'])
const onSubmit = async () => {
  await formRef.value.validate()
  formModel.value.id
    ? await artEditChannelService(formModel.value)
    : await artAddChannelService(formModel.value)
  ElMessage({
    type: 'success',
    message: formModel.value.id ? '编辑成功' : '添加成功'
  })
  dialogVisible.value = false
  // 子组件触发success事件，父组件接收信号并执行后续操作
  emit('success')
}
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="formModel.id ? '编辑分类' : '添加分类'"
    width="30%"
  >
    <el-form
      ref="formRef"
      :model="formModel"
      :rules="rules"
      label-width="100px"
      style="padding-right: 30px"
    >
      <el-form-item label="分类名称" prop="cate_name">
        <el-input
          v-model="formModel.cate_name"
          minlength="1"
          maxlength="10"
        ></el-input>
      </el-form-item>
      <el-form-item label="分类别名" prop="cate_alias">
        <el-input
          v-model="formModel.cate_alias"
          minlength="1"
          maxlength="15"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="onSubmit"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>
</template>
