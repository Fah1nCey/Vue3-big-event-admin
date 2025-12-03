import request from '@/utils/request'

// 需要的是 包含指定属性名的对象,而不是单纯的属性值
// ({ username, password, repossword }) 是 对象解构语法
// 注册请求
export const userRegisterService = ({ username, password, repassword }) => {
  return request.post('/user/register', {
    username,
    password,
    rePassword: repassword
  })
}

// 登录请求
export const userLoginService = ({ username, password }) => {
  return request.post('/user/login', { username, password })
}

// 获取用户基本信息
export const userGetInfoService = () => {
  return request.get('/user/userInfo')
}

// 更新用户个人信息
export const userUpdateInfoService = ({ id, nickname, email }) => {
  return request.put('/user/update', { id, nickname, email })
}

// 更新用户头像
export const userUploadAvatarService = (avatar) =>
  request.patch('/user/updateAvatar', { avatar })

// 更新密码
export const userUpdatePwdService = ({ old_pwd, new_pwd, re_pwd }) => {
  return request.patch('/user/updatePwd', {
    oldPwd: old_pwd,
    newPwd: new_pwd,
    rePwd: re_pwd
  })
}
