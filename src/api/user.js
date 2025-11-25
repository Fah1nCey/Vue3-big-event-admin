import request from '@/utils/request'

// 需要的是 包含指定属性名的对象,而不是单纯的属性值
// ({ username, password, repossword }) 是 对象解构语法
// 注册请求
export const userRegisterService = ({ username, password, repassword }) => {
  return request.post('/api/reg', { username, password, repassword })
}

// 登录请求
export const userLoginService = ({ username, password }) => {
  return request.post('/api/login', { username, password })
}

// 获取用户基本信息
export const userGetInfoService = () => {
  return request.get('/my/userinfo')
}

// 更新用户个人信息
export const userUpdateInfoService = ({ id, nickname, email }) => {
  return request.put('/my/userinfo', { id, nickname, email })
}

// 更新用户头像
export const userUploadAvatarService = (avatar) =>
  request.patch('/my/update/avatar', { avatar })

// 更新密码
export const userUpdatePwdService = ({ old_pwd, new_pwd, re_pwd }) => {
  return request.patch('/my/updatepwd', { old_pwd, new_pwd, re_pwd })
}
