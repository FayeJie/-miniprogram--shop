// page/register/register.js

wx. cloud. init()
Page({
  data: {
    nickname: '',
    password: '',
    address:'',
    orderlist:'',
    personal:'',
    phone:'',
    point:'100',
    thumb:''
  },
  //获取用户名
  getName(event) {
    console.log('获取输入的用户名', event.detail.value)
    this.setData({
      nickname: event.detail.value
    })
  },
  // 获取密码
  getPsw(event) {
    console.log('获取输入的密码', event.detail.value)
    this.setData({
      password: event.detail.value
    })
  },

  //注册
  register() {
    let nickname = this.data.nickname
    let password = this.data.password
    console.log("点击了注册")
    console.log("nickname", nickname)
    console.log("password", password)
  
    //注册功能的实现
    wx.cloud.database().collection('Customer').add({
      data: {
        nickname: nickname,
        password: password
      },
      success(res) {
        console.log('注册成功', res)
        wx.showToast({
          title: '注册成功',
        })
        setTimeout(() => {
          wx.navigateTo({
            url: '/page/login/login',
          })
        },1000)
       
      },
      fail(res) {
        console.log('注册失败', res)
      }
    })
  }
})