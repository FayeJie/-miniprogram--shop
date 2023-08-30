// page/component/login/login.js
Page({
  data: {
    nickname: '',
    password: ''
  },
  //获取输入的账号
  getName(event) {
    //console.log('账号', event.detail.value)
    this.setData({
      nickname: event.detail.value
    })

  },
  //获取输入的密码
  getPsw(event) {
    // console.log('密码', event.detail.value)
    this.setData({
      password: event.detail.value
    })
  },
  //点击登陆
  login() {
    let nickname = this.data.nickname
    let password = this.data.password
    console.log('账号', nickname, '密码', password)
   

    //登陆
    wx.cloud.database().collection('Customer').where({
      nickname: nickname,
      password: password
    }).get({
      success(res) {
        console.log("获取数据成功", res)
        let Customer = res.data[0]
        console.log("Customer", Customer)
        if (res.data.length > 0) {
          console.log('登录成功')
          wx.showToast({
            title: '登录成功',
          })
     
          setTimeout(() => {
            wx.switchTab({
              url: '/page/component/index',
            });
          }, 1000);
          
          
          
         
          //保存用户登陆状态
          wx.setStorageSync('Customer', Customer)
        } else {
          console.log('登陆失败')
       
          wx.showToast({
            title: '账号密码不正确',
            icon: 'error',
            duration: 1000,
          })
        }
      },
      fail(res) {
        console.log("获取数据失败", res)
      }
    })

  }
})