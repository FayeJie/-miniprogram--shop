// page/component/orders/orders.js
Page({
  data:{
    address:{},
    hasAddress: false,
    total:0,
    orders:[
        
      ]
  },

  onReady() {
    this.getTotalPrice();
  },
  
  onShow(){
    const data = wx.getStorageSync('orderInfo')
    this.setData({
      orders: data
    })
    setTimeout(() => {
      this.getTotalPrice();
    })
    const self = this;
    wx.getStorage({
      key:'address',
      success(res) {
        self.setData({
          address: res.data,
          hasAddress: true
        })
      }
    })
  },

  /**
   * 计算总价
   */
  getTotalPrice() {
    let orders = this.data.orders;
    let total = 0;
    for(let i = 0; i < orders.length; i++) {
      total += orders[i].num * orders[i].price;
    }
    this.setData({
      total: total
    })
  },

  toPay() {
    
      wx.cloud.database().collection('Order').add({
        data: {
          sumPrice: this.data.total,
          orderInfo: this.data.orders,
          userId: wx.getStorageSync('Customer')._id
        }
      })
     wx.showToast({
       title: '支付成功！',
       icon: 'success',
       duration: 1000,
     })
     setTimeout(() => {
       wx.setStorageSync("orderInfo",[])
       wx.reLaunch({
         url:'/page/component/index'
       })
     },1000)
  }
})