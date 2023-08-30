App({
  onLaunch: function () {
    wx.cloud.init({
      env:"cloud1-1gd233nb09c308cf"
    })
    console.log('App Launch')
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  },
  globalData: {
    hasLogin: false
  }
})
